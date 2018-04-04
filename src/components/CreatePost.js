import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import cookie from 'react-cookies'

import { FETCH_SUBJECT_QUERY } from './Subject'

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
      <Mutation
        mutation={CREATE_POST_QUERY}
        refetchQueries={[
          {
            query: FETCH_SUBJECT_QUERY,
            variables: { _id: this.props.subjectId }
          }
        ]}
      >
        {(createPost, { loading, error, data }) => {
          return (
            <form onSubmit={event => this.onSubmit(event, createPost)}>
              <textarea
                placeholder="Message"
                onChange={event =>
                  this.setState({ message: event.target.value })
                }
              />
              <button type="submit">Respond</button>
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
