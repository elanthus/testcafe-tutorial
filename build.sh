#!/usr/bin/env bash
#
# Runs the suite inside the container, which is the closest local equivalent to
# what CI does. `npm test` is the faster path if you have Chrome installed.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE="testcafe-tutorial"
BROWSER="${BROWSER:-chromium:headless}"
TESTS="${1:-theInternet/tests/*.js}"

docker build -t "$IMAGE" "$DIR"
docker run --rm "$IMAGE" "$BROWSER" "$TESTS"
