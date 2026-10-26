FROM node:22-slim AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
COPY shared/contracts/package.json ./shared/contracts/package.json
RUN npm ci

FROM base AS dev
COPY --chown=node:node backend ./backend
COPY --chown=node:node shared/contracts ./shared/contracts
WORKDIR /app/backend
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS build
COPY backend ./backend
COPY shared/contracts ./shared/contracts
RUN npm run build --workspace time-manager-backend

FROM node:22-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
COPY shared/contracts/package.json ./shared/contracts/package.json
RUN npm ci --omit=dev
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/shared/contracts/dist ./shared/contracts/dist
EXPOSE 3000
CMD ["node", "backend/dist/server.js"]
