import React, { Component } from 'react'

import api from '../../services/api'

import './new.css'

class New extends Component {
  state = {
    image: null,
    author: '',
    place: '',
    description: '',
    hashtags: ''
  }

  handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData()

    data.append('image', this.state.image)
    data.append('author', this.state.author)
    data.append('place', this.state.place)
    data.append('description', this.state.description)
    data.append('hashtags', this.state.hashtags)

    await api.post('posts', data)

    this.props.history.push('/')
  }

  hendleImageChange = e => {
    this.setState({ image: e.target.files[0] })
  }

  hendleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return(
      <form id="new-post" onSubmit={this.handleSubmit}>
        <input type="file" onChange={this.hendleImageChange}/>
        <input
          type="text"
          name="author"
          placeholder="Autor"
          onChange={this.hendleChange}
          value={this.state.author}
          autocomplete="off"
        />
        <input
          type="text"
          name="place"
          placeholder="Local"
          onChange={this.hendleChange}
          value={this.state.place}
          autocomplete="off"
        />
        <input
          type="text"
          name="description"
          placeholder="Legenda"
          onChange={this.hendleChange}
          value={this.state.description}
          autocomplete="off"
        />
        <input
          type="text"
          name="hashtags"
          placeholder="Hashtags"
          onChange={this.hendleChange}
          value={this.state.hashtags}
          autocomplete="off"
        />
        <button type="submit">Enviar</button>
      </form>
    )
  }
}

export default New
