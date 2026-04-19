FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package.json
COPY apps/web_client/package.json apps/web_client/package.json
COPY packages/ui-kit/package.json packages/ui-kit/package.json
COPY packages/transactional/package.json packages/transactional/package.json
RUN npm install
COPY apps/ apps/
COPY packages/ packages/
RUN npm run build --workspace=apps/web_client

FROM nginx:alpine
COPY --from=build /app/apps/web_client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
