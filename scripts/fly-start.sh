#!/bin/sh
# Fly.io entrypoint ────────────────────────────────────────────────────────────
# Two things must survive a redeploy or the bot is logged out and its data is
# gone: the `session` folder (WhatsApp credentials) and `library/database`
# (users, groups, premium). Both live on the mounted volume.
set -e

DATA_DIR="${DATA_DIR:-/data}"
APP_DIR="${APP_DIR:-/app}"

if [ -d "$DATA_DIR" ]; then
  mkdir -p "$DATA_DIR/session" "$DATA_DIR/database"

  # First boot on a fresh volume: seed the JSON database from the image so
  # owner.json / premium.json keep the values shipped in this build.
  if [ -z "$(ls -A "$DATA_DIR/database" 2>/dev/null)" ] && [ -d "$APP_DIR/library/database" ]; then
    cp -a "$APP_DIR/library/database/." "$DATA_DIR/database/" 2>/dev/null || true
    echo "[fly] seeded database from image"
  fi

  # Point the bot at the volume. Symlinks keep the code's relative paths
  # ('session', 'library/database') untouched.
  rm -rf "$APP_DIR/session"
  ln -sfn "$DATA_DIR/session" "$APP_DIR/session"

  if [ -d "$APP_DIR/library/database" ] && [ ! -L "$APP_DIR/library/database" ]; then
    rm -rf "$APP_DIR/library/database"
    ln -sfn "$DATA_DIR/database" "$APP_DIR/library/database"
  fi

  echo "[fly] session → $DATA_DIR/session, database → $DATA_DIR/database"
else
  echo "[fly] no $DATA_DIR volume mounted — session and database stay ephemeral"
fi

exec node "$APP_DIR/index.js"
