FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads/avatars

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "index.js"]
