FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpx prisma generate --schema=/app/packages/database/prisma/schema.prisma
RUN pnpm run -r build
RUN pnpm deploy --filter=gateway --prod /prod/gateway
RUN pnpm deploy --filter=handler --prod /prod/handler

FROM base AS gateway
COPY --from=build /prod/gateway /prod/gateway
WORKDIR /prod/gateway
RUN corepack install
CMD [ "pnpm", "--silent", "start" ]

FROM base AS handler
COPY --from=build /prod/handler /prod/handler
WORKDIR /prod/handler
RUN corepack install
CMD [ "pnpm", "--silent", "start" ]