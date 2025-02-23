FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY ./app ./app
COPY ./public ./public
COPY ./services ./services
COPY ./.eslintrc.json ./next.config.ts ./package*.json ./tsconfig.json ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Workaround to be able to replace client side env. variables at runtime
ENV NEXT_PUBLIC_FRONTEND_BASE_URL=__NEXT_PUBLIC_FRONTEND_BASE_URL__ 
ENV NEXT_PUBLIC_API_BASE_URL=__NEXT_PUBLIC_API_BASE_URL__
ENV NEXT_PUBLIC_OIDC_AUTHORITY=__NEXT_PUBLIC_OIDC_AUTHORITY__
ENV NEXT_PUBLIC_OIDC_CLIENT_ID=__NEXT_PUBLIC_OIDC_CLIENT_ID__
ENV NEXT_PUBLIC_OIDC_CLIENT_SECRET=__NEXT_PUBLIC_OIDC_CLIENT_SECRET__
ENV NEXT_PUBLIC_OIDC_GRANT_TYPE=__NEXT_PUBLIC_OIDC_GRANT_TYPE__
ENV NEXT_PUBLIC_OIDC_REDIRECT_URI=__NEXT_PUBLIC_OIDC_REDIRECT_URI__
ENV NEXT_PUBLIC_OIDC_RESPONSE_TYPE=__NEXT_PUBLIC_OIDC_RESPONSE_TYPE__
ENV NEXT_PUBLIC_OIDC_SCOPE=__NEXT_PUBLIC_OIDC_SCOPE__

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Remove development dependencies
# RUN npm prune --production

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/package*.json /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Workaround for basePAth issue
ENV NEXT_PUBLIC_FRONTEND_BASE_URL=
RUN \
  find /app/.next/ -type f -name "*.json" -o -name "*.js" -exec sed -i 's~"/_next/~"__NEXT_PUBLIC_FRONTEND_BASE_URL__/_next/~g' {} \;

COPY ./entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
CMD ["npm", "start"]