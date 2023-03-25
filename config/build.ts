import * as fs from "fs";
import yaml from "js-yaml";
import * as dotenv from "dotenv";

if (fs.existsSync(".env") == false) {
    fs.writeFileSync(
        ".env",
        `DOMAIN = example.com # set default domain for ssl
MONGO_USER = exampleuser  # set username
MONGO_PASSWORD = exampleuserpassword # set password
# networking
FRONTEND_PORT = 8000
    `
    );
    console.error("ERROR: No .env provided... \ncreating .env file...");
}

let env = dotenv.config().parsed;
console.log(env);

const FRONTEND_PORT = env!.FRONTEND_PORT;
const MONGO_USER = env!.MONGO_USER;
const MONGO_PASSWORD = env!.MONGO_PASSWORD;
const DOMAIN = env!.DOMAIN;

let PACKAGE_FILE = fs.existsSync("package.json")
    ? JSON.parse(fs.readFileSync("package.json").toString())
    : {};
PACKAGE_FILE.version = `${PACKAGE_FILE.version}-build${Date.now()}`;
delete PACKAGE_FILE.scripts;
const PACKAGE = PACKAGE_FILE;

const ENV = fs.existsSync(".env") ? fs.readFileSync(".env") : "";

function dockercompose() {
    const file: string = yaml.dump({
        name: PACKAGE.name,
        version: "3.8",
        volumes: {
            [PACKAGE.name]: {
                name: PACKAGE.name,
            },
        },
        services: {
            web: {
                container_name: `${PACKAGE.name}-web`,
                restart: "always",
                image: `${PACKAGE.name}-web`,
                build: ".",
                command: "node -r dotenv/config ./server.js",
                ports: [`${FRONTEND_PORT}:${FRONTEND_PORT}`],
                depends_on: ["mongo"],
                volumes: [`${PACKAGE.name}:/data/webcontents`],
                environment: {
                    DOCKER_ENV: true,
                    MONGO_USER,
                    MONGO_PASSWORD,
                },
            },
            mongo: {
                image: "mongo",
                restart: "always",
                container_name: `${PACKAGE.name}-mongodb`,
                ports: ["27017:27017"],
                volumes: [
                    `${PACKAGE.name}:/data/db`,
                    `${PACKAGE.name}:/data/configdb`,
                    "./mongo-init.sh:/docker-entrypoint-initdb.d/mongo-init.sh:ro",
                ],
                command: "mongod --quiet --auth",
                environment: {
                    MONGO_INITDB_ROOT_USERNAME: MONGO_USER,
                    MONGO_INITDB_ROOT_PASSWORD: MONGO_PASSWORD,
                    MONGO_INITDB_DATABASE: PACKAGE.name,
                },
            },
            nginx: {
                image: "valian/docker-nginx-auto-ssl",
                restart: "on-failure",
                ports: ["80:80", "443:443"],
                volumes: [`${PACKAGE.name}:/etc/resty-auto-ssl`],
                environment: {
                    ALLOWED_DOMAINS: DOMAIN,
                    SITES: `${DOMAIN}=web:${FRONTEND_PORT}`,
                },
            },
        },
    });
    return file;
}

function dockerfile(): string {
    let file: string = `
        FROM node

        WORKDIR .
        
        COPY . .
        
        EXPOSE ${FRONTEND_PORT}
        
        RUN npm install --verbose
        
        CMD node -r dotenv/config ./server.js
    `;
    return file;
}

function server(): string {
    let file: string = `
        import{handler}from"./handler.js";import{express as e}from"express";const a=e();a.use(handler),a.listen(${FRONTEND_PORT});
    `;
    return file;
}

function db(): string {
    let file: string = `
        echo "_________________________________________________"
        echo "Creating db and collection"
        mongosh --quiet --eval "db.getSiblingDB('${PACKAGE.name}').createCollection('data')"
        echo "Creating admin on ${PACKAGE.name} database"
        mongosh --quiet --eval "db.getSiblingDB('${PACKAGE.name}').createUser({user: '${MONGO_USER}',pwd: '${MONGO_PASSWORD}',roles: [{ role: 'readWriteAnyDatabase',db: 'admin' },{ role: 'userAdminAnyDatabase',db: 'admin' },{ role: 'dbAdminAnyDatabase',db: 'admin' }] })"
        echo "_________________________________________________"
    `;
    return file;
}

function envfile(): string {
    let file: string = `
        ${ENV}
        PACKAGE_NAME = ${PACKAGE.name}
        VITE_PACKAGE_NAME = ${PACKAGE.name}
        VITE_DOCKER_ENV = true
        VITE_MONGO_USER = ${MONGO_USER}
        VITE_MONGO_PASSWORD = ${MONGO_PASSWORD}
    `;
    return file;
}

function build() {
    if (fs.existsSync("./build") == false) fs.mkdirSync("./build");
    fs.writeFileSync("./build/Dockerfile", dockerfile());
    fs.writeFileSync("./build/server.js", server());
    fs.writeFileSync("./build/.env", envfile());
    fs.writeFileSync("./build/.dockerignore", `api\nvault`);
    fs.writeFileSync("./build/package.json", JSON.stringify(PACKAGE));
    fs.writeFileSync("./build/mongo-init.sh", db());
    fs.writeFileSync("./build/docker-compose.yaml", dockercompose());
}

build();

fs.unlinkSync("./config/build.js");
