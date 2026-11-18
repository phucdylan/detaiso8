FROM nodered/node-red:5.0.9

USER root

WORKDIR /usr/src/node-red

COPY package.json /usr/src/node-red/package.json

RUN npm install --omit=dev --no-audit --no-fund

COPY --chown=node-red:root flows.json /data/flows.json
COPY --chown=node-red:root settings.js /data/settings.js

ENV FLOWS=flows.json

USER node-red

EXPOSE 1880
