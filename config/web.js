import fs from "fs"
import config from "../package.json" assert { type: "json" }
export function build() {
    
let server = ''
if(fs.existsSync('server.js')) server = fs.readFileSync('server.js')
let env = ''
if(fs.existsSync('.env')) env = fs.readFileSync('.env')
let npm = ''
if(fs.existsSync('./package.json')) npm = JSON.parse(fs.readFileSync('package.json'))
npm.version = `${config.version}-build${Date.now()}`
delete npm.scripts
npm = JSON.stringify(npm)

let content = {

// Dockerfile
docker: `
FROM node

WORKDIR .

COPY . .

EXPOSE ${process.env.FRONTEND_PORT}

RUN npm install --verbose

CMD node -r dotenv/config ./server.js
`,
// Dockerfile

//mongo-init.sh
dbinit: `
echo "_________________________________________________"
echo "_________________________________________________"
echo "_________________________________________________"
echo "_________________________________________________"
echo "_________________________________________________"
echo "Creating db and collection"
mongosh --quiet --eval "db.getSiblingDB('${config.name}').createCollection('data')"
echo "Creating admin on ${config.name} database"
mongosh --quiet --eval "db.getSiblingDB('${config.name}').createUser({user: '${process.env.MONGO_USER}',pwd: '${process.env.MONGO_PASSWORD}',roles: [{ role: 'readWriteAnyDatabase',db: 'admin' },{ role: 'userAdminAnyDatabase',db: 'admin' },{ role: 'dbAdminAnyDatabase',db: 'admin' }] })"
echo "_________________________________________________"
echo "_________________________________________________"
echo "_________________________________________________"
echo "_________________________________________________"
echo "_________________________________________________"
`,
//mongo-init.sh

// server.js
server: `
// GENERATED CONTENT
console.log('Template by XL Software')
import { handler } from './handler.js';
import express from 'express'
const app = express();
app.use(handler);
app.listen(${process.env.FRONTEND_PORT})
// GENERATED CONTENT
${server}
`,
// server.js

// .env
env: `
${env}
PACKAGE_NAME = ${config.name}
VITE_PACKAGE_NAME = ${config.name}
VITE_DOCKER_ENV = true
VITE_MONGO_USER = ${process.env.MONGO_USER}
VITE_MONGO_PASSWORD = ${process.env.MONGO_PASSWORD}
`,
// .env

// package.json
npm: npm,
// package.json

// .dockerignore
ignore: `
api
vault
`
// .dockerignore
}

    
    fs.writeFileSync('./build/Dockerfile', content.docker)
    fs.writeFileSync('./build/server.js', content.server)
    fs.writeFileSync('./build/.env', content.env)
    fs.writeFileSync('./build/.dockerignore', content.ignore)
    fs.writeFileSync('./build/package.json', content.npm)
    fs.writeFileSync('./build/mongo-init.sh', content.dbinit)
    console.log('Web container config loaded at port ', process.env.FRONTEND_PORT)
}
