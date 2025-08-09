FROM ghcr.io/puppeteer/puppeteer:24.11.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copia archivos de package.json primero
COPY package*.json ./

# Cambia dueño del directorio para el usuario pptruser
RUN chown -R pptruser:pptruser /app

# Cambia a usuario pptruser (opcional, la imagen ya lo usa)
USER pptruser

# Ahora instala dependencias (sin scripts para evitar descargar Chromium)
RUN npm install --ignore-scripts

# Copia el resto del código
COPY --chown=pptruser:pptruser . .

EXPOSE 3000

CMD ["node", "index.js"]
