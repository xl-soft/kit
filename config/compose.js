import fs from "fs"
import config from "../package.json" assert { type: "json" }

export function compose() {
let file = `name: ${config.name}
version: "3.8"
volumes:
  ${config.name}:
    name: ${config.name}
services:
  web:
    container_name: ${config.name}-web
    restart: "always"
    image: ${config.name}-web
    build: .
    command: "node -r dotenv/config ./server.js"
    ports:
      - "${process.env.FRONTEND_PORT}:${process.env.FRONTEND_PORT}"
    depends_on:
      - "mongo"
    volumes:
      - "${config.name}:/data/webcontents"
    environment:
      - DOCKER_ENV = true
  mongo:
    image: "mongo"
    restart: "always"
    container_name: "${config.name}-mongodb"
    ports:
      - "${process.env.MONGO_EXT_PORT}:27017"
    volumes:
      - "${config.name}:/data/db"
      - "${config.name}:/data/configdb"
      - ./mongo-init.sh:/docker-entrypoint-initdb.d/mongo-init.sh:ro
    command: "mongod --quiet --auth"
    environment:
      - MONGO_INITDB_ROOT_USERNAME = ${process.env.MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD = ${process.env.MONGO_PASSWORD}
      - MONGO_INITDB_DATABASE = ${config.name}
  nginx:
    image: valian/docker-nginx-auto-ssl
    restart: on-failure
    ports:
      - 80:80
      - 443:443
    volumes:
      - ${config.name}:/etc/resty-auto-ssl
    environment:
      ALLOWED_DOMAINS: '${process.env.DOMAIN}'
      SITES: '${process.env.DOMAIN}=web:${process.env.FRONTEND_PORT}'
`
// docker-compose.yaml

fs.writeFileSync('./build/docker-compose.yaml', file)
}