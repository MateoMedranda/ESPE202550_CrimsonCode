# Usamos la imagen oficial de Puppeteer que ya tiene Chromium y dependencias
FROM ghcr.io/puppeteer/puppeteer:24.11.1

# Si quieres usar el Chromium instalado en la imagen, salta la descarga al instalar Puppeteer (ya incluido)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Directorio de la app
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias sin descargar Chromium extra
RUN npm install --ignore-scripts

# Copia el resto del código
COPY . .

# Expone puerto, ajusta si tu app escucha en otro puerto
EXPOSE 3000

# Comando para iniciar tu app (ajusta según tu entrypoint)
CMD ["node", "index.js"]
