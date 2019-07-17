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
  }

  hendleLike = id => {
    api.post(`posts/${id}/like`)
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
              <button type="button" onClick={() => {}}>
                <img src={more} alt="mais"/>
              </button>
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
                    <img className="curtidas"src={comment} alt=""/>
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
            </footer>
          </article>
        )) }
      </section>
    )
  }
}

export default Feed
