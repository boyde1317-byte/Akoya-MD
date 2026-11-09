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

  # If an earlier boot ran without the volume mounted, real creds can be sitting
  # in the image layer. Rescue them onto the volume first: losing them means the
  # bot asks for a fresh pairing code on every deploy, which is what gets a
  # number flagged.
  if [ -d "$APP_DIR/session" ] && [ ! -L "$APP_DIR/session" ] && [ -f "$APP_DIR/session/creds.json" ]; then
    if [ ! -f "$DATA_DIR/session/creds.json" ]; then
      cp -a "$APP_DIR/session/." "$DATA_DIR/session/" 2>/dev/null || true
      echo "[fly] rescued session creds from the container into the volume"
    fi
  fi

  # Point the bot at the volume. Symlinks keep the code's relative paths
  # ('session', 'library/database') untouched.
  if [ -e "$APP_DIR/session" ] || [ -L "$APP_DIR/session" ]; then
    rm -rf "$APP_DIR/session"
  fi
  ln -sfn "$DATA_DIR/session" "$APP_DIR/session"

  if [ -d "$APP_DIR/library/database" ] && [ ! -L "$APP_DIR/library/database" ]; then
    rm -rf "$APP_DIR/library/database"
    ln -sfn "$DATA_DIR/database" "$APP_DIR/library/database"
  fi

  if [ -f "$DATA_DIR/session/creds.json" ]; then
    if grep -q '"registered":true' "$DATA_DIR/session/creds.json" 2>/dev/null; then
      echo "[fly] session -> $DATA_DIR/session (linked, no pairing needed)"
    else
      echo "[fly] session -> $DATA_DIR/session (creds present, not registered yet)"
    fi
  else
    echo "[fly] session -> $DATA_DIR/session (empty, first pairing)"
  fi
  echo "[fly] database -> $DATA_DIR/database"
else
  echo "[fly] WARNING: no $DATA_DIR volume mounted — session and database stay ephemeral"
fi

exec node "$APP_DIR/index.js"
