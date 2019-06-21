import React, { Component } from 'react';
import io from 'socket.io-client'
import api from '../../services/api'

import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';

import camera from '../../assets/camera.png'
import like from '../../assets/like.png'
import more from '../../assets/more.png'
import send from '../../assets/send.png'
import comment from '../../assets/comment.png'

import { FlatList } from 'react-native-gesture-handler';
export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('News')}>
        <Image source={camera}/>
      </TouchableOpacity>
    )
  })
  state =  {
    feed: []
  }
  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get('posts')

    this.setState({ feed: response.data })
  }

  registerToSocket = () => {
    const socket = io('http://10.0.2.2:3333')

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
  return (
    <View style={styles.container}>
      <FlatList
        data={this.state.feed}
        keyExtractor={post => post._id}
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <View style={styles.feedItemHeder}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{item.author}</Text>
                <Text style={styles.place}>{item.place}</Text>
              </View>
              <Image source={more}/>
            </View>
            <Image style={styles.feedImage} source={{ uri: `http://10.0.2.2:3333/files/${item.image}` }}/>
            <View style={styles.feedItemFooter}>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.action} onPress={() => this.hendleLike(item._id)}>
                  <Image source={like}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action}>
                  <Image source={comment}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action}>
                  <Image source={send}/>
                </TouchableOpacity>
              </View>
              <View style={styles.textFooter}>
                <Text style={styles.likes}>{item.likes} Curtidas</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedItem: {
    marginTop: 20,
  },
  feedItemHeder: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  place: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15,
  },
  feedItemFooter: {
    paddingHorizontal: 15,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    marginRight: 8,
  },
  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  hashtags: {
    color: '#7159c1'
  }
})
