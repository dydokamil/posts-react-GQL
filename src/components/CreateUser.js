import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { GET_USERS_QUERY } from './Users'

class CreateUser extends React.Component {
  state = { username: '', email: '', password: '' }

  onSubmit = event => {
    event.preventDefault()

    const { username, email, password } = this.state

    this.props
      .mutate({
        variables: { username, email, password },
        refetchQueries: [{ query: GET_USERS_QUERY }]
      })
      .then(({ data }) => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  render () {
    return (
      <div>
        <h1>Create a new user</h1>
        <form onSubmit={this.onSubmit}>
          <input
            placeholder="Username"
            onChange={evt =>
              this.setState({
                username: evt.target.value
              })
            }
          />
          <input
            placeholder="Email"
            onChange={evt =>
              this.setState({
                email: evt.target.value
              })
            }
          />
          <input
            placeholder="Password"
            type="password"
            onChange={evt =>
              this.setState({
                password: evt.target.value
              })
            }
          />
          <button type="submit">Create</button>
        </form>
      </div>
    )
  }
}

const CREATE_NEW_USER_QUERY = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      _id
      username
    }
  }
`

export default graphql(CREATE_NEW_USER_QUERY)(CreateUser)
