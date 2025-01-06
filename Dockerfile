FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build --prod
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/~s367527
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 4201
CMD ["nginx", "-g", "daemon off;"]
