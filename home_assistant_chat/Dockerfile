FROM ghcr.io/home-assistant/base:3.24

ARG BUILD_VERSION=0.1.6

RUN apk add --no-cache python3

# Copy only the application files. No legacy s6 service definitions are used.
COPY rootfs/app/ /app/

RUN /usr/bin/python3 -m py_compile /app/server.py

LABEL io.hass.type="app" io.hass.version="${BUILD_VERSION}" io.hass.arch="amd64"

# Keep the base image's /init entrypoint; run one foreground Python process.
CMD ["/usr/bin/python3", "/app/server.py"]
