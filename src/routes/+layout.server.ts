import mongoose from 'mongoose';
import dotenv from 'dotenv';

let docker = import.meta.env.MODE
let env = dotenv.config().parsed
console.log('----------------------------------------------------------------------------------------------------------------')
console.log(dotenv.config().parsed)
console.log('----------------------------------------------------------------------------------------------------------------')
let database = docker == 'production' ? env?.VITE_PACKAGE_NAME : 'dev'
let credentials = docker == 'production' ? `${env?.VITE_MONGO_USER}:${env?.VITE_MONGO_PASSWORD}@` : ''
let host = docker == 'production' ? 'mongo:27017' : '127.0.0.1:27017'
let url = `mongodb://${credentials}${host}/${database}`
console.log(`Current MODE == ${docker}`)
console.log('Trying to connect to MongoDB')
console.log(`Connecting: ${url}`)
mongoose.set('strictQuery', false)
mongoose.connect(url)
mongoose.connection.on('connected', () => console.log(`MongoDB connected to ${database} database`))
