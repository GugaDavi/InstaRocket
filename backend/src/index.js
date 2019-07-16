const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const App = express()

const server = require('http').Server(App)
const io = require('socket.io')(server)

mongoose.connect("mongodb+srv://gugaadmin:Lovegod777*@cluster0-iosms.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true
})

App.use((req, res, next) => {
  req.io = io

  next()
})

App.use(cors())
App.use(express.json())

App.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')))

App.use(require('./routes'))

server.listen(3333)
