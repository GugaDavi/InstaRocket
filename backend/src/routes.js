const express = require('express')
const multer = require('multer')
const upLoadConfig = require('./config/Upload')
const PostController = require('./controllers/PostController')
const LikeController = require('./controllers/LikeController')
const CommentController = require('./controllers/CommentController')

const routes = new express.Router()

const upload = multer(upLoadConfig)

routes.get('/posts', upload.single('image'), PostController.index)
routes.post('/posts', upload.single('image'), PostController.store)
routes.post('/posts/:id/like', LikeController.store)

routes.delete('/posts/:id', PostController.destroy)
routes.post('/posts/:id/comment', CommentController.store)

module.exports =  routes
