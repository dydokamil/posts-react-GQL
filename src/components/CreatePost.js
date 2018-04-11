import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import cookie from 'react-cookies'

import './Common.css'

export class CreatePost extends React.Component {
  state = { message: '' }

  onSubmit = (event, createPost) => {
    event.preventDefault()

    const token = cookie.load('token')
    const { message } = this.state
    const { subjectId } = this.props

    createPost({
      variables: {
        subjectId,
        token,
        message
      }
    })
  }

  render () {
    return (
      <Mutation mutation={CREATE_POST_QUERY}>
        {(createPost, { loading, error, data }) => {
          return (
            <form onSubmit={event => this.onSubmit(event, createPost)}>
              <div>
                <textarea
                  className="full-width"
                  placeholder="Message"
                  onChange={event =>
                    this.setState({ message: event.target.value })
                  }
                />
              </div>
              <div>
                <button className="action-button" type="submit">
                  Respond
                </button>
              </div>
            </form>
          )
        }}
      </Mutation>
    )
  }
}

const CREATE_POST_QUERY = gql`
  mutation createPost($subjectId: String!, $token: String!, $message: String!) {
    createPost(message: $message, subjectId: $subjectId, token: $token) {
      message
      author {
        _id
        username
      }
    }
  }
`

export default CreatePost
