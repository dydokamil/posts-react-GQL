import React from 'react'
import gql from 'graphql-tag'
import { Mutation, graphql } from 'react-apollo'
import cookie from 'react-cookies'
import { connect } from 'react-redux'

import { GET_SUBJECTS_QUERY } from './Subjects'

export class CreateUser extends React.Component {
  state = { title: '', message: '', authenticated: false }

  onSubmit = (event, createSubject) => {
    event.preventDefault()

    const { message, title } = this.state

    createSubject({
      variables: {
        token: cookie.load('token'),
        message,
        title
      }
    })
  }

  render () {
    return (
      <Mutation
        mutation={CREATE_NEW_SUBJECT_QUERY}
        refetchQueries={[{ query: GET_SUBJECTS_QUERY }]}
      >
        {(createSubject, { data, error, loading }) => {
          if (loading) return <div>Loading...</div>
          return (
            <div>
              <h1>Create Subject</h1>
              <form onSubmit={event => this.onSubmit(event, createSubject)}>
                <input
                  id="title-input"
                  placeholder="Title"
                  onChange={evt =>
                    this.setState({
                      title: evt.target.value
                    })
                  }
                />
                <input
                  id="message-input"
                  placeholder="Message"
                  onChange={evt =>
                    this.setState({
                      message: evt.target.value
                    })
                  }
                />
                <button type="submit">Create</button>
              </form>
              {error && <div>{error.message}</div>}
            </div>
          )
        }}
      </Mutation>
    )
  }
}

const CREATE_NEW_SUBJECT_QUERY = gql`
  mutation createSubject($token: String!, $title: String!, $message: String!) {
    createSubject(token: $token, title: $title, message: $message) {
      _id
    }
  }
`

const mapStateToProps = state => ({
  username: state.loginReducer.username
})

export default connect(mapStateToProps)(CreateUser)
