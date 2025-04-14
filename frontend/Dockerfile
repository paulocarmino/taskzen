FROM node:22-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]