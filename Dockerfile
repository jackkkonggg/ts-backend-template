FROM node:18-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
COPY . .

RUN pnpm install --frozen-lockfile

CMD [ "pnpm", "dev" ]
