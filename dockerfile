FROM node:slim

RUN apt-get update && apt-get install -y curl gnupg ca-certificates

# Detect architecture and install the appropriate Chromium version
ARG ARCH
RUN if [ "$(dpkg --print-architecture)" = "amd64" ]; then \
        curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
        sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
        apt-get update && apt-get install -y google-chrome-stable --no-install-recommends; \
    elif [ "$(dpkg --print-architecture)" = "arm64" ]; then \
        apt-get update && apt-get install -y chromium --no-install-recommends; \
    else \
        echo "Unsupported architecture"; \
        exit 1; \
    fi

RUN rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /express-docker

COPY ./package.json .
RUN npm install

COPY . .

COPY docker.env .env

CMD [ "node", "--env-file=.env", "index.js" ]

EXPOSE 3000
