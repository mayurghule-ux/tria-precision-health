# TRIA for Android

A thin, offline WebView wrapper around the web app at the repository root.

There is no second copy of the app in here. `syncWebAssets` copies `index.html`,
`manifest.webmanifest`, `sw.js` and `assets/**` from the repository root into the
APK at build time, so the web app is the single source of truth and the Android
module stays about 250 lines.

## What the wrapper actually does

| Concern | How it is handled |
| --- | --- |
| Serving the bundle | `WebViewAssetLoader` on `https://appassets.androidplatform.net`, which gives the page a secure origin so `localStorage` and the service worker behave as they do in a browser |
| Network | The app holds **no `INTERNET` permission**, and every request that is not an asset is answered locally with a 403 — so the privacy claim on the app's own About screen is enforced, not just asserted |
| Dark mode | `setAlgorithmicDarkeningAllowed(true)`, so the system setting arrives as `prefers-color-scheme` and the app's own dark palette is used rather than WebView inverting the page |
| Back button | Walks WebView history, which is the app's section history, then leaves the app |
| Keyboard | `adjustResize` plus the IME inset, so the doctor-brief notes field stays visible while typing |
| Edge to edge | System-bar and cutout insets are applied as padding, which Android 15 makes mandatory |
| External links | Handed to the browser via an intent; they never load inside the app |

## Building

Requires JDK 17 and an Android SDK with platform 35.

```bash
cd android
./gradlew assembleDebug     # app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease   # app/build/outputs/apk/release/app-release.apk
```

If you have no local Android SDK, push the branch instead and let the
**Build APK** workflow do it — the APK arrives as a downloadable artifact on the
run.

## Signing

With no signing secrets configured, the release build falls back to the debug
key. That installs fine, but because CI generates a fresh debug key on every
run, **upgrading means uninstalling the previous copy first**.

To get stable, upgradeable builds, create a key once:

```bash
keytool -genkeypair -v \
  -keystore tria.jks \
  -alias tria \
  -keyalg RSA -keysize 4096 -validity 10000
```

Then add four repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `KEYSTORE_BASE64` | `base64 -w0 tria.jks` |
| `KEYSTORE_PASSWORD` | the keystore password |
| `KEY_ALIAS` | `tria` |
| `KEY_PASSWORD` | the key password |

Keep `tria.jks` somewhere safe and out of the repository. Losing it means you can
never upgrade an installed copy again — only uninstall and reinstall.

The same four values are read from the environment for local release builds, as
`TRIA_KEYSTORE`, `TRIA_KEYSTORE_PASSWORD`, `TRIA_KEY_ALIAS` and `TRIA_KEY_PASSWORD`.

## Installing the APK on a phone

1. Download the artifact from the workflow run and unzip it.
2. Copy the `-release.apk` to the phone, or open the link on the phone directly.
3. Tap it. Android will ask once for permission to install from that app
   (file manager or browser); grant it and continue.

This is a sideloaded build, so Play Protect may show a warning about an app from
an unknown developer. That is expected for any APK not distributed through the
Play Store.

## Versions

AGP 8.7.3 · Kotlin 2.0.21 · Gradle 8.11.1 · `compileSdk`/`targetSdk` 35 ·
`minSdk` 24 (Android 7.0).
