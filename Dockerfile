# Stage 1: Build an Angular Docker Image
FROM node:18.20-bullseye AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install --force
COPY . /app
ARG configuration=production
RUN npm run build -- --configuration $configuration
 
# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/book-my-show/browser  /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
 