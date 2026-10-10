#!/usr/bin/env bash
# Builds QSI Offline: fetch Box at the pinned commit, apply the QSI patch, assemble the APK.
#
#   qsi-offline/build.sh [work-dir]
#
# Needs JDK 21, an Android SDK with NDK 27.2.12479018 and CMake 3.22.1, and network access
# to GitHub and Google's Maven. The first build compiles llama.cpp, whisper.cpp and
# stable-diffusion.cpp from source and takes a while.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOX_REPO="https://github.com/jegly/box"
BOX_COMMIT="$(tr -d '[:space:]' < "$HERE/BOX_COMMIT")"
WORK="${1:-$HERE/build}"

echo "Box $BOX_COMMIT -> $WORK"
rm -rf "$WORK"
mkdir -p "$WORK"
cd "$WORK"

git init -q .
git remote add origin "$BOX_REPO"
git fetch -q --depth 1 origin "$BOX_COMMIT"
git checkout -q FETCH_HEAD

# Native engines are submodules pinned by Box, and stable-diffusion.cpp nests its own
# ggml submodule, so fetch recursively. Shallow-fetch exactly the pinned commits.
git submodule update --init --recursive --depth 1 --jobs 3

git apply --whitespace=nowarn "$HERE/qsi-offline.patch"
echo "QSI patch applied."

cd Android/src
./gradlew --no-daemon :app:assembleRelease
echo "Built: $WORK/Android/src/app/build/outputs/apk/release/"
