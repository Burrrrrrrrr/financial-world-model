#!/bin/zsh

set -e

PROJECT_DIR="${0:A:h}"
NODE_BIN="/Users/gaolijin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
LOCAL_URL="http://127.0.0.1:3000/"
BUILD_STAMP=".local-build-stamp"
SERVER_LOG=".local-server.log"

cd "$PROJECT_DIR"

if curl -fsS "$LOCAL_URL" >/dev/null 2>&1; then
  open "$LOCAL_URL"
  exit 0
fi

NEEDS_BUILD=false
if [[ ! -d dist || ! -f "$BUILD_STAMP" ]]; then
  NEEDS_BUILD=true
elif find app public -type f -newer "$BUILD_STAMP" -print -quit | grep -q .; then
  NEEDS_BUILD=true
elif find next.config.ts vite.config.ts package.json pnpm-lock.yaml -newer "$BUILD_STAMP" -print -quit | grep -q .; then
  NEEDS_BUILD=true
fi

if [[ "$NEEDS_BUILD" == true ]]; then
  echo "正在准备阅读版本，首次启动可能需要一两分钟……"
  "$NODE_BIN" node_modules/vinext/dist/cli.js build > "$SERVER_LOG" 2>&1
  touch "$BUILD_STAMP"
fi

"$NODE_BIN" node_modules/vinext/dist/cli.js start -p 3000 -H 127.0.0.1 >> "$SERVER_LOG" 2>&1 &
SERVER_PID=$!

for attempt in {1..60}; do
  if curl -fsS "$LOCAL_URL" >/dev/null 2>&1; then
    open "$LOCAL_URL"
    wait "$SERVER_PID"
    exit 0
  fi
  sleep 1
done

echo "网页没有在一分钟内启动。请把 .local-server.log 发给 Codex 检查。"
wait "$SERVER_PID"
