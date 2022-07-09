const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  role: {
    type: String
  },
  password: {
    type: String 
  }
})

module.exports = mongoose.model('Client', ClientSchema)