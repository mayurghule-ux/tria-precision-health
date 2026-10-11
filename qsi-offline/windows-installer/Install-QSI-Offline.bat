@echo off
rem Double-click this file. It runs the PowerShell installer next to it.
if not exist "%~dp0Install-QSI-Offline.ps1" (
  echo Install-QSI-Offline.ps1 is missing. Save it in the same folder as this file, then run this again.
  echo.
  pause
  exit /b 1
)
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-QSI-Offline.ps1" -NoPause
echo.
pause
