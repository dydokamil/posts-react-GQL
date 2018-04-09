import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import cookie from 'react-cookies'

import './EditSubject.css'
import { FETCH_SUBJECT_QUERY } from './Subject'

class EditSubject extends React.Component {
  state = { message: this.props.message }

  submitEdit = (event, updateSubject) => {
    event.preventDefault()

    updateSubject({
      variables: {
        subjectId: this.props.subjectId,
        token: cookie.load('token'),
        message: this.state.message
      }
    })

    this.props.closeEditSubject()
  }

  render () {
    return (
      <Mutation
        mutation={EDIT_SUBJECT_QUERY}
        refetchQueries={[
          {
            query: FETCH_SUBJECT_QUERY,
            variables: { _id: this.props.subjectId }
          }
        ]}
      >
        {(updateSubject, { loading, error, data }) => (
          <div className="edit-subject">
            <h1>Edit Subject</h1>
            <h2>{this.props.subjectTitle}</h2>
            <form onSubmit={event => this.submitEdit(event, updateSubject)}>
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
              <button onClick={this.props.closeEditSubject}>Close</button>
            </div>
            <hr />
          </div>
        )}
      </Mutation>
    )
  }
}

const EDIT_SUBJECT_QUERY = gql`
  mutation updateSubject(
    $subjectId: String!
    $token: String!
    $message: String!
  ) {
    updateSubject(subjectId: $subjectId, token: $token, message: $message) {
      _id
    }
  }
`

export default EditSubject
