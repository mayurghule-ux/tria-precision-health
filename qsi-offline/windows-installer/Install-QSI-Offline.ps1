# Installs QSI Offline on the Android device connected to this PC by USB.
#
# What it does: downloads Google's Android platform tools (for adb), downloads
# the QSI Offline APK from the project's GitHub release, waits for the device,
# and runs "adb install". It does not touch any other app on the device.
#
# Before running: on the tablet, Settings > About tablet > tap "Build number"
# seven times, then Settings > Developer options > turn on "USB debugging".
# When the tablet asks "Allow USB debugging?", tick "Always allow" and tap Allow.

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'   # Invoke-WebRequest is much faster without the progress bar

$Version  = '1.0.9'
$ApkUrl   = "https://github.com/mayurghule-ux/tria-precision-health/releases/download/qsi-offline-v$Version/QSI-Offline-$Version.apk"
$ApkBytes = 395660002
$ToolsUrl = 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip'
$Package  = 'in.quantumsi.offline'

$Work = Join-Path $env:LOCALAPPDATA 'QSI-Offline-Installer'
New-Item -ItemType Directory -Force -Path $Work | Out-Null

function Step([string]$Message) { Write-Host ""; Write-Host "==> $Message" -ForegroundColor Cyan }
function Hint([string]$Message) { Write-Host "    $Message" -ForegroundColor Yellow }

Step 'Android platform tools (adb)'
$adb = Join-Path $Work 'platform-tools\adb.exe'
if (-not (Test-Path $adb)) {
    $zip = Join-Path $Work 'platform-tools.zip'
    Invoke-WebRequest -Uri $ToolsUrl -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $Work -Force
    Remove-Item $zip
}
Write-Host "    $adb"

Step "QSI Offline $Version (377 MB)"
$apk = Join-Path $Work "QSI-Offline-$Version.apk"
if (-not (Test-Path $apk) -or (Get-Item $apk).Length -ne $ApkBytes) {
    Invoke-WebRequest -Uri $ApkUrl -OutFile $apk
}
if ((Get-Item $apk).Length -ne $ApkBytes) { throw "The APK download is incomplete. Run this again." }
Write-Host "    $apk"

Step 'Waiting for the Android device over USB'
& $adb start-server | Out-Null
$deadline = (Get-Date).AddMinutes(5)
$serial = $null
$lastHint = ''
while ((Get-Date) -lt $deadline) {
    $rows = @(& $adb devices | Select-Object -Skip 1 | Where-Object { $_.Trim() -ne '' })
    $ready = @($rows | Where-Object { $_ -match "`tdevice$" })
    if ($ready.Count -gt 0) { $serial = ($ready[0] -split "`t")[0]; break }

    $hint = if ($rows | Where-Object { $_ -match "`tunauthorized$" }) {
        'On the tablet: tick "Always allow" and tap Allow on the "Allow USB debugging?" prompt.'
    } elseif ($rows | Where-Object { $_ -match "`toffline$" }) {
        'The tablet shows as offline. Unplug the cable and plug it back in.'
    } else {
        'No device seen yet. Check the cable, and on the tablet turn on Settings > Developer options > USB debugging.'
    }
    if ($hint -ne $lastHint) { Hint $hint; $lastHint = $hint }
    Start-Sleep -Seconds 3
}
if (-not $serial) { throw 'No authorised Android device was found over USB within 5 minutes.' }
$model = (& $adb -s $serial shell getprop ro.product.model).Trim()
Write-Host "    Found: $model ($serial)"

Step "Installing on $model"
$output = & $adb -s $serial install -r $apk 2>&1 | Out-String
Write-Host $output.Trim()
if ($output -match 'INSTALL_FAILED_UPDATE_INCOMPATIBLE') {
    # An older build of this same app was signed with a different key. Only this
    # package is removed; every other app on the device is left alone.
    Hint "An older QSI Offline build is installed with a different key; replacing it."
    & $adb -s $serial uninstall $Package | Out-Null
    $output = & $adb -s $serial install -r $apk 2>&1 | Out-String
    Write-Host $output.Trim()
}
if ($output -notmatch 'Success') { throw 'adb install did not report Success; see the message above.' }

Step "Done. QSI Offline $Version is installed on $model."
Write-Host '    Open it on the tablet and download QSI Core, then QSI Voice under Voice Input.'
