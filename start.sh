#!/usr/bin/env bash
# Serve PawMatch.html locally so Babel-standalone can load the .jsx files.
# Usage:  ./start.sh          (port 8080)
#         ./start.sh 9000     (custom port)
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8080}"
URL="http://localhost:${PORT}/PawMatch.html"

echo "→ Serving $(pwd) on ${URL}"
echo "  Press Ctrl+C to stop."
( sleep 0.6 && open "${URL}" ) &
exec python3 -m http.server "${PORT}"
