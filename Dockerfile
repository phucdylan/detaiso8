FROM nodered/node-red:5.0.9

WORKDIR /data

COPY package.json package-lock.json /data/

RUN npm ci --no-audit --no-fund --omit=dev

WORKDIR /usr/src/node-red

COPY --chown=node-red:root flows.json /data/flows.json
COPY --chown=node-red:root settings.js /data/settings.js

ENV FLOWS=flows.json

EXPOSE 10000
