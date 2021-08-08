FROM node:alpine
WORKDIR /app
RUN npm install typescript -g
COPY . .
RUN tsc Main.ts
CMD [ "node", "Main.js" ]