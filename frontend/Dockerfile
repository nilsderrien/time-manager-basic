FROM node:20-slim AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
COPY shared/contracts/package.json ./shared/contracts/package.json
RUN npm ci

FROM base AS dev
COPY frontend ./frontend
COPY shared/contracts ./shared/contracts
WORKDIR /app/frontend
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS build
COPY frontend ./frontend
COPY shared/contracts ./shared/contracts
RUN npm run build --workspace time-manager-frontend

FROM nginx:alpine AS prod
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
