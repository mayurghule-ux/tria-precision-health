# Install QSI Offline from a Windows PC

For a tablet or phone plugged into the PC by USB.

1. On the Android device: Settings → About → tap **Build number** 7 times, then
   Settings → Developer options → turn on **USB debugging**.
   (On Samsung devices, Build number is under About tablet → **Software information**.)
2. Plug the device into the PC and unlock its screen.
3. Save **Install-QSI-Offline.bat** and **Install-QSI-Offline.ps1** into the same folder
   (on GitHub, open each file and use its *Download raw file* button; a browser may warn
   about the .bat, choose Keep) and double-click **Install-QSI-Offline.bat**.
4. When the device asks "Allow USB debugging?", tick *Always allow* and tap **Allow**.
   If the prompt does not appear, unplug the cable and plug it back in.

The script downloads Google's `adb` tool and the QSI Offline APK into
`%LOCALAPPDATA%\QSI-Offline-Installer`, waits up to 5 minutes for the device, and
installs. Copying the 377 MB APK to the device takes a few minutes with no output.
If an older QSI Offline build signed with a different key is present, that one app is
uninstalled first (its settings, chat history and any models it had downloaded are
removed, so QSI Core and QSI Voice have to be downloaded again) and the new build is
installed. No other app is ever removed.

The installer installs exactly QSI Offline **1.0.9** (the `$Version` at the top of the
`.ps1`). Every CI build publishes a newer release, and Android will not install an older
build over a newer one, so if the device already has a newer QSI Offline the script stops
with a message saying so and changes nothing. Get a newer copy of the installer, or, if
that exact version is wanted, uninstall QSI Offline on the device first (that also
deletes the models it downloaded).

If the script still shows no device after a minute, Windows may need a USB driver
for the device (the script says so on screen): open Device Manager and look for the
device with a yellow warning sign. For Samsung devices install the Samsung USB driver
(https://developer.samsung.com/android-usb-driver); for others open
Settings → Windows Update → Advanced options → Optional updates → Driver updates
(on Windows 10: Windows Update → View optional updates). Then unplug and re-plug
the cable.
