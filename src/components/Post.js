import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import cookie from 'react-cookies'

import { timestampToDateTime } from './Subject'

export class Post extends React.Component {
  state = {
    editing: false,
    message: this.props.response.message,
    createdAt: this.props.response.createdAt,
    author: this.props.response.author,
    postId: this.props.response._id,
    _id: this.props.response._id
  }

  handleDelete = (event, deletePost) => {
    event.preventDefault()

    deletePost({
      variables: {
        token: cookie.load('token'),
        postId: this.state.postId
      }
    })
  }

  handleEdit = (event, editPost, postId) => {
    event.preventDefault()

    editPost({
      variables: {
        postId: this.state.postId,
        token: cookie.load('token'),
        message: this.state.message
      }
    })
    this.setState({ editing: false })
  }

  render () {
    const { response } = this.props
    return this.state.editing ? (
      <Mutation mutation={EDIT_POST_QUERY}>
        {(editPost, _) => {
          return (
            <div>
              <form onSubmit={event => this.handleEdit(event, editPost)}>
                <div>
                  <textarea
                    onChange={event =>
                      this.setState({
                        message: event.target.value
                      })
                    }
                    value={this.state.message}
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
              <button
                onClick={() =>
                  this.setState({
                    editing: false
                  })
                }
              >
                Close
              </button>
              <hr />
            </div>
          )
        }}
      </Mutation>
    ) : (
      <Mutation mutation={DELETE_POST_QUERY}>
        {(deletePost, { loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error) return <div>{error.message}</div>

          return (
            <div key={this.state._id}>
              <div>{response.message}</div>
              <div>
                <small>{this.state.author.username}</small>
              </div>
              <div>
                <small>{timestampToDateTime(this.state.createdAt)}</small>
              </div>
              {response.editedAt && (
                <small>Edited: {timestampToDateTime(response.editedAt)}</small>
              )}
              {this.state.author.username === cookie.load('username') && (
                <div>
                  <button
                    onClick={event =>
                      this.handleDelete(event, deletePost, this.state._id)
                    }
                  >
                    Delete
                  </button>
                  <button onClick={() => this.setState({ editing: true })}>
                    Edit
                  </button>
                </div>
              )}

              <hr />
            </div>
          )
        }}
      </Mutation>
    )
  }
}

export const DELETE_POST_QUERY = gql`
  mutation deletePost($postId: String!, $token: String!) {
    deletePost(postId: $postId, token: $token) {
      _id
    }
  }
`

const EDIT_POST_QUERY = gql`
  mutation editPost($postId: String!, $token: String!, $message: String!) {
    editPost(postId: $postId, token: $token, message: $message) {
      _id
      editedAt
    }
  }
`

export default Post
