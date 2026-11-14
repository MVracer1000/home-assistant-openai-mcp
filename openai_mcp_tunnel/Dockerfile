ARG BUILD_FROM=ghcr.io/home-assistant/base:3.23
FROM ghcr.io/openai/tunnel-client:v0.0.20 AS tunnel_client
FROM ${BUILD_FROM}

ARG BUILD_VERSION=0.1.0

# Copy the official, version-pinned OpenAI tunnel client and its bundled
# cloudflared companion into the Home Assistant app image.
COPY --from=tunnel_client /usr/bin/tunnel-client /usr/bin/tunnel-client
COPY --from=tunnel_client /usr/bin/cloudflared /usr/bin/cloudflared

# Install the s6 service definition.
COPY rootfs /

RUN chmod 0755 /etc/services.d/openai_mcp_tunnel/run

LABEL \
  io.hass.type="app" \
  io.hass.version="${BUILD_VERSION}" \
  io.hass.arch="amd64"
