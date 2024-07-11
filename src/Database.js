process.loadEnvFile()
const { MongoClient } = require('mongodb');


const URI = process.env.MONGODB_URLSTRING
const client = new MongoClient(URI)
const DATABASE_NAME = process.env.DATABASE_NAME
const COLLECTION_NAME = process.env.COLLECTION_NAME

async function connectToMongoDB(req, res, next) {
    try {
      await client.connect()
      console.log('Conectandose a mongoDB')
      const db = client.db(DATABASE_NAME).collection(COLLECTION_NAME)
      req.db = db
      next()
    } catch (error) {
      console.error('Error al conectar a MongoDB')
      return null
    }
  }
  
  async function disconnectFromMongoDB() {
    try {
      if (client) {
        await client.close()
        console.log('Desconectandose de mongoDB')
      }
    } catch (error) {
      console.error('Error al desconectar de MongoDB')
    }
  }
  
  module.exports = { connectToMongoDB, disconnectFromMongoDB }