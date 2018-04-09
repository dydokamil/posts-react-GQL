import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import cookie from 'react-cookies'

import './EditSubject.css'
import { FETCH_SUBJECT_QUERY } from './Subject'

class EditPost extends React.Component {
  state = { message: this.props.message }

  submitEdit = (event, editPost) => {
    event.preventDefault()

    editPost({
      variables: {
        postId: this.props.postId,
        token: cookie.load('token'),
        message: this.state.message
      }
    })
  }

  render () {
    return (
      <Mutation
        mutation={EDIT_POST_QUERY}
        refetchQueries={[
          {
            query: FETCH_SUBJECT_QUERY,
            variables: { _id: this.props.subjectId }
          }
        ]}
      >
        {(editPost, { loading, error, data }) => (
          <div className="edit-post">
            <h1>Edit Post</h1>
            <form onSubmit={event => this.submitEdit(event, editPost)}>
              <div>
                <textarea
                  placeholder="Message"
                  value={this.state.message}
                  onChange={event =>
                    this.setState({ message: event.target.value })
                  }
                />
              </div>
              <button type="submit">Edit</button>
            </form>
            <div>
              <button onClick={this.props.closeEditPost}>Close</button>
            </div>
          </div>
        )}
      </Mutation>
    )
  }
}

const EDIT_POST_QUERY = gql`
  mutation editPost($postId: String!, $token: String!, $message: String!) {
    editPost(postId: $postId, token: $token, message: $message) {
      _id
    }
  }
`

export default EditPost
