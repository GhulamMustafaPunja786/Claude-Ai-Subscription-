# Hugging Face Spaces (and any Docker host) image for n8n Community Edition.
# Spaces must listen on port 7860. Persistence comes from Postgres (Supabase),
# not the container filesystem — HF disk is wiped on rebuild/sleep.
FROM docker.n8n.io/n8nio/n8n:2.36.3

USER root

RUN mkdir -p /home/node/.n8n \
  && chown -R node:node /home/node

ENV N8N_PORT=7860 \
    N8N_LISTEN_ADDRESS=0.0.0.0 \
    N8N_PROTOCOL=https \
    NODE_ENV=production \
    N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
    N8N_RUNNERS_ENABLED=true \
    N8N_BLOCK_ENV_ACCESS_IN_NODE=false \
    N8N_GIT_NODE_DISABLE_BARE_REPOS=true \
    N8N_PROXY_HOPS=1 \
    N8N_PUSH_BACKEND=websocket \
    GENERIC_TIMEZONE=Asia/Karachi \
    TZ=Asia/Karachi

EXPOSE 7860

USER node
