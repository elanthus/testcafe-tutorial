#!/usr/bin/env bash
#
# Runs the suites inside the container, which is the closest local equivalent
# to what CI does. `npm test` is the faster path if you have Chrome installed.
#
#   ./build.sh                  both suites, as CI runs them
#   ./build.sh react            the local fixture app suite only
#   ./build.sh the-internet     the third-party site suite only
#   BROWSER=firefox ./build.sh  any browser the image provides
#
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE="testcafe-tutorial"
BROWSER="${BROWSER:-chromium:headless}"
SUITE="${1:-all}"

run_the_internet() {
  docker run --rm "$IMAGE" "$BROWSER" 'theInternet/tests/*.js'
}

# The React suite has nothing to talk to until the fixture app is served.
# TestCafe starts it and shuts it down again via --app; without that the suite
# fails with ConnectionRefused.
run_react() {
  docker run --rm "$IMAGE" "$BROWSER" 'reactSelectors/tests/*.js' \
    --app 'node fixtures/serve.mjs'
}

case "$SUITE" in
  all|react|the-internet) ;;
  *)
    echo "Unknown suite '$SUITE'. Use one of: all, react, the-internet." >&2
    exit 1
    ;;
esac

docker build -t "$IMAGE" "$DIR"

case "$SUITE" in
  all)
    run_react
    run_the_internet
    ;;
  the-internet)
    run_the_internet
    ;;
  react)
    run_react
    ;;
esac
