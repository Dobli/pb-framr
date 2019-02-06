# stage: 1
FROM node:11 as react-build
WORKDIR /app
COPY . ./
RUN yarn
ENV SASS_PATH=/app/node_modules
RUN yarn build
# stage: 2 - production container image
FROM nginx:alpine
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
