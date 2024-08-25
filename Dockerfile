FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=gateway --prod /prod/gateway
RUN pnpm deploy --filter=bot --prod /prod/bot

FROM base AS gateway
COPY --from=build /prod/gateway /prod/gateway
WORKDIR /prod/gateway
CMD [ "pnpm", "--silent", "start" ]

FROM base AS bot
COPY --from=build /prod/bot /prod/bot
WORKDIR /prod/bot
CMD [ "pnpm", "--silent", "start" ]