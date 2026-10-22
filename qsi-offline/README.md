# QSI Offline

A private, on-device AI app for Android, branded for Quantum SI. It is a fork of
[Box by Jegly](https://github.com/jegly/box) (itself a fork of Google AI Edge Gallery),
kept here as a patch so the upstream code stays untouched and easy to update.

## What it does

| In the app | Behind it |
| --- | --- |
| **QSI Core** — chat, prompt lab, ask about a photo, ask about audio, agent chat with on-device tools | Gemma 4 E2B (LiteRT-LM), Apache 2.0, pinned to an exact upstream commit |
| **QSI Voice** — speech to text, language detected automatically | Whisper large-v3-turbo, 5-bit (whisper.cpp), MIT |

Model names never appear in the app. Both models are downloaded once from inside the
app, then everything runs offline. Nothing typed, spoken or photographed leaves the
phone, and chat history is stored encrypted behind a biometric lock (both from Box).

## What the patch changes

- Name, launcher icon, splash and accent colour → QSI Offline; application id
  `in.quantumsi.offline`, so it installs alongside Box rather than over it.
- The model list is reduced to QSI Core and QSI Voice, with neutral local file names and
  no links to upstream model pages.
- Model import is removed, and so are the features that need other models (image
  generation, the demo games, the example task).
- Speech recognition detects the language instead of forcing English.
- Native code is built for arm64 only (every current phone), which cuts build time and size.
- About screen credits Box and Google AI Edge Gallery, as their Apache 2.0 licence requires.

## Brand

Matched to quantumsi.in: a white light theme with a violet accent (`#6D28D9`), the
blue-to-violet of the site's atom mark for the title gradient and the launcher icon,
and a charcoal dark theme with the same accents. Box's wallpaper-derived Material You
colours are replaced by this fixed palette so the app looks the same on every phone.
To adjust: `ui/theme/Color.kt` (palette), `ui/theme/Theme.kt` (gradients, card tints)
and `res/drawable/ic_app_icon_{background,foreground}.xml` (icon), then regenerate the patch.

## Building

CI does it: the **Build QSI Offline** workflow produces `QSI-Offline-1.0.<n>.apk` as an
artifact. Locally, with JDK 21 and an Android SDK including NDK 27.2.12479018 and CMake 3.22.1:

```bash
qsi-offline/build.sh /tmp/qsi-build
```

## Updating to a newer Box

1. Change `BOX_COMMIT`.
2. Check out that commit, `git apply qsi-offline.patch`, fix any rejects.
3. `git diff --binary > qsi-offline.patch` and commit.

## Requirements on the phone

Android 15 or newer (Box's minimum). QSI Core is a 2.6 GB download and Box recommends
8 GB of RAM for it; QSI Voice is about 0.6 GB.
