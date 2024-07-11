const express = require('express');
const app = express()
process.loadEnvFile()
const { ObjectId } = require('mongodb')
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/Database.js');
const port = process.env.PORT ?? 3000
const morgan = require('morgan')

//middleware
app.use(express.json());
app.use(morgan('dev'))

app.use('/electronicos', connectToMongoDB, async (req, res, next) => {
    res.on('finish', async () => {
      await disconnectFromMongoDB()
    })
    next()
  })

app.get('/', (req,res) => {
    res.send('bienvenido a la API de dispositivos electronicos ')
})

//obtener todos los dispositivos
app.get('/electronicos', async (req,res) => {
    try {
        const dispositivos = await req.db.find().toArray()
        res.json(dispositivos)
    } catch (error) {
        res.status(500).send('error al conectarse a la DB')  
    } 
})

// //obtener una fruta en particular
app.get('/electronicos/:id', async (req,res) => {
    try{
        const { id } = req.params
        const objectId = new ObjectId(id)
        const dispositivo = await req.db.findOne({ _id: objectId })
        if (dispositivo) return res.json(dispositivo)
        res.status(404).json({ message: 'Peli no encontrada' })
      }catch (error) {
        res.status(500).send('error al conectarse a la DB')  
      } 
      })


//Obtener dispositivo por nombre 
app.get('/electronicos/nombre/:nombre', async (req,res) => {
    try{
        const { nombre } = req.params
        const electronicos = await req.db.findOne({ nombre : {$regex: nombre, $options: 'i' }})
        if (electronicos) {res.json(electronicos)}
        else {
            res.status(404)
                .json({message: 'Dispositivos no encontrado'})
    }}
    catch (error) { 
        res.status(500)
           .json('error del servidor')
    }
} )





app.listen(port, () => {
    console.log(` app listening on   http://localhost:${port}`);
})