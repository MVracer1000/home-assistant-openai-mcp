ARG BUILD_FROM=ghcr.io/home-assistant/base:3.23
FROM ${BUILD_FROM}

ARG BUILD_VERSION=0.1.2

RUN apk add --no-cache python3

COPY rootfs /

RUN chmod 0755 /app/server.py && /usr/bin/python3 -m py_compile /app/server.py

LABEL io.hass.type="app" io.hass.version="${BUILD_VERSION}" io.hass.arch="amd64"

CMD ["/usr/bin/python3", "/app/server.py"]
