import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import cookie from 'react-cookies'

import { FETCH_SUBJECT_QUERY } from './Subject'

export class Post extends React.Component {
  handleDelete = (event, deletePost, postId) => {
    event.preventDefault()

    deletePost({
      variables: {
        token: cookie.load('token'),
        postId
      }
    })
  }

  render () {
    const { response } = this.props
    return (
      <Mutation
        mutation={DELETE_POST_QUERY}
        refetchQueries={[
          {
            query: FETCH_SUBJECT_QUERY,
            variables: { _id: this.props.subjectId }
          }
        ]}
      >
        {(deletePost, { loading, error, data }) => {
          return (
            <div key={response._id}>
              <div>{response.message}</div>
              <div>
                <small>{response.author.username}</small>
              </div>
              <div>
                <small>{response.createdAt}</small>
              </div>
              {response.author.username === cookie.load('username') && (
                <div>
                  <button
                    onClick={event =>
                      this.handleDelete(event, deletePost, response._id)
                    }
                  >
                    Delete
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

export default Post
