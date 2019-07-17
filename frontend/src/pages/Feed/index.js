import React, { Component } from 'react'
import api from '../../services/api'
import io from 'socket.io-client'

import './Feed.css'

import more from '../../assets/more.svg'
import like from '../../assets/like.svg'
import comment from '../../assets/comment.svg'
import send from '../../assets/send.svg'

class Feed extends Component {
  state =  {
    feed: [],
    commit: false,
    post: false,
    id: '',
    author: '',
    comment: ''
  }
  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get('posts')

    this.setState({ feed: response.data })
  }

  registerToSocket = () => {
    const socket = io('http://localhost:3333')

    socket.on('post', newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] })
    })

    socket.on('like', likePost => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === likePost._id ? likePost : post
        )
      })
    })

    socket.on('comment', commentPost => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === commentPost._id ? commentPost : post
        )
      })
    })

    socket.on('delete', deletePost => {
      this.setState({
        feed: this.state.feed.filter(post => post._id !== deletePost._id)
      })
    })
  }

  commitar = () => {
    this.setState({ commit: !this.state.commit })
  }

  hendleLike = id => {
    api.post(`posts/${id}/like`)
  }

  hendleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault()

    const { author, comment, id } = this.state

    await api.post(`/posts/${id}/comment`, { author, comment })

    this.setState({ commit: !this.state.commit })
  }

  hendleComment = id => {
    this.setState({ id: id })
  }

  handleOpenExclude = e => {
    this.setState({ post: !this.state.post, id: e })
  }

  handleExclude = async e => {
    e.preventDefault()

    const { id } = this.state

    await api.delete(`posts/${id}`)

    this.setState({ post: !this.state.post })
  }

  render() {
    return(
      <section id="post-list">
        { this.state.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place}</span>
              </div>
              <button type="button" onClick={() => this.handleOpenExclude(post._id)}>
                <img src={more} alt="mais"/>
              </button>
              {this.state.post && <button onClick={this.handleExclude} className="excluir">Excluir</button>}
            </header>
            <img src={`http://localhost:3333/files/${post.image}`} alt=""/>
            <footer>
              <div className="actions">
                <div className="curtidas">
                  <button type="button" onClick={() => this.hendleLike(post._id)}>
                    <img src={like} alt=""/>
                  </button><span>{post.likes}</span>
                </div>
                <div className="curtidas">
                  <button type="button">
                    <img className="curtidas"src={comment} alt="Comentar" onClick={this.commitar}/>
                  </button><span>{post.comments.length}</span>
                </div>
                <img className="curtidas" src={send} alt=""/>

              </div>
              <p>
                {post.description}
                <span>{post.hashtags}</span>
              </p>
              {post.comments.map((comment, index) => (
                <ul>
                  <li key={index}><strong>{comment.author}</strong> <span>{comment.comment}</span></li>
                </ul>
              ))}
              {this.state.commit && <form action="" className="addComment" onSubmit={this.handleSubmit}>
                <input
                  onChange={this.hendleChange}
                  name="author"
                  placeholder="Autor"
                  className="author"
                  type="text"
                  autocomplete="off"
                />
                <input
                  onChange={this.hendleChange}
                  name="comment"
                  placeholder="Comentario"
                  className="comment"
                  type="text"
                  autocomplete="off"
                  onFocus={() => this.hendleComment(post._id)}
                />
                <button type="submit" >Adicionar</button>
              </form>}
            </footer>

          </article>
        )) }

      </section>

    )
  }
}

export default Feed
