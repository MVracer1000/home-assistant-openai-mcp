ARG BUILD_FROM=ghcr.io/home-assistant/base:3.23
FROM ${BUILD_FROM}

ARG BUILD_VERSION=0.1.0

RUN apk add --no-cache python3

COPY rootfs /

RUN chmod 0755 /etc/services.d/home_assistant_chat/run /app/server.py \\\n    && /usr/bin/python3 -m py_compile /app/server.py

LABEL \
  io.hass.type="app" \
  io.hass.version="${BUILD_VERSION}" \
  io.hass.arch="amd64"
