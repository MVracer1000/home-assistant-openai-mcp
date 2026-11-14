ARG BUILD_FROM=ghcr.io/home-assistant/base:3.24
FROM ${BUILD_FROM}

ARG BUILD_VERSION=0.1.0
ARG TUNNEL_CLIENT_VERSION=0.0.20
ARG TUNNEL_CLIENT_SHA256=2f06ce5a17425c74a827e7038692936e973ae388e7eec728c40efee1fb5f139d

RUN apk add --no-cache ca-certificates curl unzip \
    && mkdir -p /tmp/tunnel-client \
    && curl -fsSL \
      "https://github.com/openai/tunnel-client/releases/download/v${TUNNEL_CLIENT_VERSION}/tunnel-client-v${TUNNEL_CLIENT_VERSION}-linux-amd64.zip" \
      -o /tmp/tunnel-client.zip \
    && echo "${TUNNEL_CLIENT_SHA256}  /tmp/tunnel-client.zip" | sha256sum -c - \
    && unzip -q /tmp/tunnel-client.zip -d /tmp/tunnel-client \
    && install -m 0755 "$(find /tmp/tunnel-client -type f -name tunnel-client -print -quit)" /usr/bin/tunnel-client \
    && install -m 0755 "$(find /tmp/tunnel-client -type f -name cloudflared -print -quit)" /usr/bin/cloudflared \
    && /usr/bin/tunnel-client --help >/dev/null \
    && rm -rf /tmp/tunnel-client /tmp/tunnel-client.zip

COPY rootfs /

RUN chmod 0755 /etc/services.d/openai_mcp_tunnel/run

LABEL \
  io.hass.type="app" \
  io.hass.version="${BUILD_VERSION}" \
  io.hass.arch="amd64"
