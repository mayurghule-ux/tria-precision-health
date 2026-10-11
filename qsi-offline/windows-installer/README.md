# Install QSI Offline from a Windows PC

For a tablet or phone plugged into the PC by USB.

1. On the Android device: Settings → About → tap **Build number** 7 times, then
   Settings → Developer options → turn on **USB debugging**.
2. Plug the device into the PC.
3. Download both files in this folder to the same place and double-click
   **Install-QSI-Offline.bat**.
4. When the device asks "Allow USB debugging?", tick *Always allow* and tap **Allow**.

The script downloads Google's `adb` tool and the QSI Offline APK into
`%LOCALAPPDATA%\QSI-Offline-Installer`, waits for the device, and installs.
It never removes any other app. If an older QSI Offline build signed with a
different key is present, that one build is replaced.
