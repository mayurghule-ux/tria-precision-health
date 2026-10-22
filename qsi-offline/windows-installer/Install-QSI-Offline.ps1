# Installs QSI Offline on the Android device connected to this PC by USB.
#
# What it does: downloads Google's Android platform tools (for adb), downloads
# the QSI Offline APK from the project's GitHub release, waits for the device,
# and runs "adb install". It does not touch any other app on the device.
#
# Before running: on the tablet, Settings > About tablet > tap "Build number"
# seven times, then Settings > Developer options > turn on "USB debugging".
# (On Samsung tablets, Build number is under About tablet > Software information.)
# When the tablet asks "Allow USB debugging?", tick "Always allow" and tap Allow. The prompt only
# shows on an unlocked screen, and once denied or dismissed it does not come back until the
# cable is unplugged and plugged in again.

# Install-QSI-Offline.bat passes -NoPause because it pauses by itself. Started directly
# (right-click > Run with PowerShell) the script keeps the window open at the end instead.
param([switch]$NoPause)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'   # Invoke-WebRequest is much faster without the progress bar

# CI publishes a new release, 1.0.<run number>, on every push that touches qsi-offline/**,
# and each one carries a higher Android version code. The installer asks GitHub for the newest
# "qsi-offline-v*" release and falls back to the release below when that lookup fails. A
# tablet that already has a newer one is left alone; see INSTALL_FAILED_VERSION_DOWNGRADE below.
$Repo     = 'mayurghule-ux/tria-precision-health'
$Version  = '1.0.9'
$ApkUrl   = "https://github.com/$Repo/releases/download/qsi-offline-v$Version/QSI-Offline-$Version.apk"
$ApkBytes = 395660002   # exact size of that release asset; update together with $Version
$ToolsUrl = 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip'
$Package  = 'in.quantumsi.offline'

# Returns the newest QSI Offline release as @{ Version; Url; Bytes }, or $null when GitHub
# cannot be reached. Releases are listed newest first, but sort by version anyway.
function Get-LatestRelease {
    try {
        $releases = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases?per_page=30" -UseBasicParsing `
            -Headers @{ 'User-Agent' = 'QSI-Offline-Installer'; 'Accept' = 'application/vnd.github+json' }
    } catch { return $null }
    $best = $null
    foreach ($r in @($releases)) {
        if ($r.draft -or $r.prerelease -or "$($r.tag_name)" -notmatch '^qsi-offline-v(\d+\.\d+\.\d+)$') { continue }
        $v = [Version]$Matches[1]
        $asset = @($r.assets) | Where-Object { "$($_.name)" -like '*.apk' } | Select-Object -First 1
        if ($null -eq $asset -or -not $asset.size) { continue }
        if ($null -eq $best -or $v -gt $best.Version) {
            $best = @{ Version = $v; Url = "$($asset.browser_download_url)"; Bytes = [long]$asset.size }
        }
    }
    return $best
}

$Work = Join-Path $env:LOCALAPPDATA 'QSI-Offline-Installer'
New-Item -ItemType Directory -Force -Path $Work | Out-Null

function Step([string]$Message) { Write-Host ""; Write-Host "==> $Message" -ForegroundColor Cyan }
function Hint([string]$Message) { Write-Host "    $Message" -ForegroundColor Yellow }

# Runs adb with its stderr merged into the output and returns everything as one string.
# Windows PowerShell 5.1 turns redirected stderr lines into error records, and with
# $ErrorActionPreference = 'Stop' the first such line would abort the script. adb
# reports install failures on stderr, so run it with 'Continue' and keep the text.
function Invoke-Adb {
    $ErrorActionPreference = 'Continue'
    $lines = & $adb @args 2>&1 | ForEach-Object { "$_" }
    return (@($lines) -join "`n").Trim()
}

# Keeps the window open when the script was started directly: right-click > Run with PowerShell
# closes the console the moment the script ends, taking the result or the error message with it.
function Wait-BeforeClosing {
    if ($NoPause -or $Host.Name -ne 'ConsoleHost' -or -not [Environment]::UserInteractive -or [Console]::IsInputRedirected) { return }
    Write-Host ''
    try { Read-Host 'Press Enter to close this window' | Out-Null } catch { }
}

# Everything below runs inside try/catch so that a failure shows one plain red sentence. Left
# uncaught, Windows PowerShell 5.1 prints every throw as a six-line error record (position,
# caret marker, CategoryInfo, FullyQualifiedErrorId) that repeats the message three times and
# reads like a crash to a non-technical user.
try {
    Step 'Looking up the newest QSI Offline release'
    $latest = Get-LatestRelease
    if ($null -ne $latest) {
        $Version  = "$($latest.Version)"
        $ApkUrl   = $latest.Url
        $ApkBytes = $latest.Bytes
        Write-Host "    $Version"
    } else {
        Hint "GitHub could not be reached for the release list; using the built-in release $Version."
    }

    Step 'Android platform tools (adb)'
    $adb = Join-Path $Work 'platform-tools\adb.exe'
    if (-not (Test-Path $adb)) {
        $zip = Join-Path $Work 'platform-tools.zip'
        Invoke-WebRequest -Uri $ToolsUrl -OutFile $zip -UseBasicParsing
        Expand-Archive -Path $zip -DestinationPath $Work -Force
        Remove-Item $zip
    }
    Write-Host "    $adb"

    Step "QSI Offline $Version ($([math]::Round($ApkBytes / 1MB)) MB)"
    $apk = Join-Path $Work "QSI-Offline-$Version.apk"
    if (-not (Test-Path $apk) -or (Get-Item $apk).Length -ne $ApkBytes) {
        Write-Host "    Downloading. This takes several minutes and shows no progress; please wait."
        Invoke-WebRequest -Uri $ApkUrl -OutFile $apk -UseBasicParsing
    }
    $actual = (Get-Item $apk).Length
    if ($actual -ne $ApkBytes) { throw "The APK on disk is $actual bytes but $ApkBytes bytes were expected. The download is incomplete; run this again." }
    Write-Host "    $apk"

    Step 'Waiting for the Android device over USB'
    & $adb start-server | Out-Null
    $started  = Get-Date
    $deadline = $started.AddMinutes(5)
    $serial = $null
    $lastHint = ''
    while ((Get-Date) -lt $deadline) {
        $rows = @(& $adb devices | Select-Object -Skip 1 | Where-Object { $_.Trim() -ne '' })
        $ready = @($rows | Where-Object { $_ -match "`tdevice$" })
        if ($ready.Count -gt 0) { $serial = ($ready[0] -split "`t")[0]; break }

        $hint = if ($rows | Where-Object { $_ -match "`tunauthorized$" }) {
            'On the tablet: unlock the screen, then on the "Allow USB debugging?" prompt tick "Always allow" and tap Allow. If no prompt is showing, unplug the cable and plug it back in.'
        } elseif ($rows | Where-Object { $_ -match "`toffline$" }) {
            'The tablet shows as offline. Unplug the cable and plug it back in.'
        } elseif (((Get-Date) - $started).TotalSeconds -lt 60) {
            'No device seen yet. Check the cable, and on the tablet turn on Settings > Developer options > USB debugging.'
        } else {
            # adb lists nothing at all when Windows has no driver bound to the tablet's ADB
            # interface (offline PC, or driver updates blocked by policy). Samsung tablets need
            # Samsung's own driver; most others get one from Windows Update's optional updates.
            "Still no device after a minute. If the cable is good and USB debugging is on, Windows is probably missing the USB driver:`n" +
            "    open Device Manager and look for the tablet with a yellow warning sign.`n" +
            "    Samsung: install the Samsung USB driver from https://developer.samsung.com/android-usb-driver`n" +
            "    Others:  Settings > Windows Update > Advanced options > Optional updates > Driver updates`n" +
            "             (Windows 10: Windows Update > View optional updates > Driver updates).`n" +
            "    Then unplug the cable and plug it back in."
        }
        if ($hint -ne $lastHint) { Hint $hint; $lastHint = $hint }
        Start-Sleep -Seconds 3
    }
    if (-not $serial) { throw 'No authorised Android device was found over USB within 5 minutes. If the tablet is plugged in with USB debugging on, install its USB driver (see above) and run this again.' }
    $model = "$(& $adb -s $serial shell getprop ro.product.model)".Trim()
    Write-Host "    Found: $model ($serial)"

    Step "Installing on $model"
    # adb streams the APK to the device and prints nothing until the device-side install finishes.
    Hint "Copying the $([math]::Round($ApkBytes / 1MB)) MB APK to the tablet and installing it takes a few minutes. Nothing more is printed until it finishes; keep this window open."
    $output = Invoke-Adb -s $serial install -r $apk
    Write-Host $output
    if ($output -match 'INSTALL_FAILED_UPDATE_INCOMPATIBLE') {
        # An older build of this same app was signed with a different key. Only this
        # package is removed; every other app on the device is left alone.
        Hint "An older QSI Offline build signed with a different key is installed. Uninstalling that one app (its settings, chat history and downloaded models go with it, so QSI Core and QSI Voice must be downloaded again), then installing $Version. The copy runs again and takes a few more minutes with no output."
        $removed = Invoke-Adb -s $serial uninstall $Package
        Write-Host $removed
        if ($removed -notmatch 'Success') {
            if (-not $removed) { $removed = 'adb gave no output' }
            throw "Could not remove the old $Package build, so the new one cannot be installed. adb said: $removed"
        }
        $output = Invoke-Adb -s $serial install -r $apk
        Write-Host $output
    }
    if ($output -match 'INSTALL_FAILED_VERSION_DOWNGRADE') {
        # Android refuses to install a lower version code over a higher one, and "adb install -d"
        # does not lift that on a retail device for a non-debuggable app. Stop with a plain
        # explanation; the tablet is exactly as it was.
        $installed = ''
        if ((Invoke-Adb -s $serial shell dumpsys package $Package) -match 'versionName=(\S+)') { $installed = $Matches[1] }
        $have = if ($installed) { "QSI Offline $installed" } else { 'a newer QSI Offline' }
        throw "The tablet already has $have, which is newer than $Version, so Android refused this older build. Nothing was changed. Get the latest copy of this installer, or, if you really want $Version, uninstall QSI Offline on the tablet first (Settings > Apps > QSI Offline > Uninstall; that also deletes the models it downloaded) and run this again."
    }
    if ($output -notmatch 'Success') { throw 'adb install did not report Success; see the message above.' }

    Step "Done. QSI Offline $Version is installed on $model."
    Write-Host '    Open it on the tablet and download QSI Core, then QSI Voice under Voice Input.'
} catch {
    Write-Host ''
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "    (Install-QSI-Offline.ps1 line $($_.InvocationInfo.ScriptLineNumber))" -ForegroundColor DarkGray
    Wait-BeforeClosing
    exit 1
}

Wait-BeforeClosing
