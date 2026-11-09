# ─── Akoya-MD container ─────────────────────────────────────────────────────
# Node 22 LTS. The bot needs sharp + ffmpeg-static (prebuilt), nothing to compile.
FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    PORT=8080 \
    DATA_DIR=/data

WORKDIR /app

# Dependencies first, so a code change does not reinstall 469 packages.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

COPY . .
RUN chmod +x scripts/fly-start.sh

EXPOSE 8080

# The entrypoint puts the WhatsApp session and the JSON database on the
# mounted volume, then starts the bot. Without that, every deploy would
# log the bot out and wipe library/database.
CMD ["./scripts/fly-start.sh"]
