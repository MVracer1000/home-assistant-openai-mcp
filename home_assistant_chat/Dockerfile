FROM python:3.12-alpine3.22

ARG BUILD_VERSION=0.1.4

WORKDIR /app

COPY rootfs/app/ /app/

RUN python -m py_compile /app/server.py

LABEL io.hass.type="app" io.hass.version="${BUILD_VERSION}" io.hass.arch="amd64"

EXPOSE 8099

CMD ["python", "/app/server.py"]
