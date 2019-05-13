FROM node:carbon
ADD src /opt/src/
#ADD data /opt/data/
WORKDIR /opt/src/
RUN npm install
RUN npm install -S moment

ENTRYPOINT ["node", "musician.js"]
