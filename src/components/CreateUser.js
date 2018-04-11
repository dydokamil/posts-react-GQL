import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { GET_USERS_QUERY } from './Users'

export class CreateUser extends React.Component {
  state = { username: '', email: '', password: '' }

  onSubmit = (event, createUser) => {
    event.preventDefault()

    const { username, email, password } = this.state

    createUser({
      variables: {
        username,
        email,
        password
      }
    })
  }

  render () {
    return (
      <Mutation
        mutation={CREATE_NEW_USER_QUERY}
        refetchQueries={[{ query: GET_USERS_QUERY }]}
      >
        {(createUser, { data, error, loading }) => {
          if (loading) return <div>Loading...</div>
          return (
            <div>
              <h1>Create User</h1>
              <form onSubmit={event => this.onSubmit(event, createUser)}>
                <input
                  id="user-input"
                  placeholder="Username"
                  onChange={evt =>
                    this.setState({
                      username: evt.target.value
                    })
                  }
                />
                <input
                  id="email-input"
                  placeholder="Email"
                  onChange={evt =>
                    this.setState({
                      email: evt.target.value
                    })
                  }
                />
                <input
                  id="password-input"
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
              {error && <div>{error.message}</div>}
            </div>
          )
        }}
      </Mutation>
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

export default CreateUser
