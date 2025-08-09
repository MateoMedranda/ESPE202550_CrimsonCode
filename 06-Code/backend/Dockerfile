# Usamos la imagen oficial de Puppeteer que ya tiene Chromium y dependencias
FROM ghcr.io/puppeteer/puppeteer:24.11.1

# Si quieres usar el Chromium instalado en la imagen, salta la descarga al instalar Puppeteer (ya incluido)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Directorio de la app
WORKDIR /app

RUN npm ci

COPY . .
CMD ["node","index.js"]


