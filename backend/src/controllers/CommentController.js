const Comment = require('../models/Comment')
const Post = require('../models/Post')

module.exports ={
  async store(req, res) {
    const { author, comment } = req.body

    const post = await Post.findById(req.params.id)

    post.comments.push({ author, comment })

    await post.save()

    return res.json(post)
  }
}
