const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  author: String,
  comment: String,
}, {
  timestamps: true
})

module.exports = mongoose.model('Comments', CommentSchema)
