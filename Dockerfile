FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package.json
COPY apps/web_client/package.json apps/web_client/package.json
COPY packages/ui-kit/package.json packages/ui-kit/package.json
COPY packages/transactional/package.json packages/transactional/package.json
RUN npm install
COPY apps/ apps/
COPY packages/ packages/
ARG VITE_BACKEND_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_RECAPTCHA_SITE_KEY
ARG VITE_MARKET_DATA_URL
ARG VITE_TRADING_ENGINE_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY
ENV VITE_MARKET_DATA_URL=$VITE_MARKET_DATA_URL
ENV VITE_TRADING_ENGINE_URL=$VITE_TRADING_ENGINE_URL
RUN npm run build --workspace=apps/web_client

FROM nginx:alpine
COPY --from=build /app/apps/web_client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
