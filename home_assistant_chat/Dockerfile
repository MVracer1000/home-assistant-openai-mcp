ARG BUILD_FROM=ghcr.io/home-assistant/base:3.23
FROM ${BUILD_FROM}

ARG BUILD_VERSION=0.1.3

RUN apk add --no-cache python3

COPY rootfs /

# Remove any stale legacy service definition from an earlier image layer.
RUN rm -rf /etc/services.d/home_assistant_chat /etc/s6-overlay/s6-rc.d/home_assistant_chat \
    && chmod 0755 /app/server.py \
    && /usr/bin/python3 -m py_compile /app/server.py

LABEL io.hass.type="app" io.hass.version="${BUILD_VERSION}" io.hass.arch="amd64"

CMD ["/usr/bin/python3", "/app/server.py"]
