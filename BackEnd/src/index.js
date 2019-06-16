const express = require('express')
const mongoose = require('mongoose')

const App = express()

mongoose.connect("mongodb+srv://gugaadmin:Lovegod777*@cluster0-iosms.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true
})

App.use(require('./routes'))

App.listen(3005)
