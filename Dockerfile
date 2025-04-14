FROM node:22-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm install

COPY . .

RUN pnpm prisma generate
RUN pnpm run build

EXPOSE 4000

ENTRYPOINT ["sh", "./entrypoint.sh"]