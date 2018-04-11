import React from 'react'
import gql from 'graphql-tag'
import cookie from 'react-cookies'
import { Mutation } from 'react-apollo'

class ChangePassword extends React.Component {
  state = { password1: '', password2: '' }

  handleChangePassword = (event, changePassword) => {
    event.preventDefault()

    changePassword({
      variables: {
        token: cookie.load('token'),
        password: this.state.password1
      }
    })
  }

  render () {
    return (
      <Mutation mutation={UPDATE_PASSWORD_QUERY}>
        {(updatePassword, { loading, data, error }) => {
          return (
            <div>
              <h1>Change Password</h1>
              <form
                onSubmit={event =>
                  this.handleChangePassword(event, updatePassword)
                }
              >
                <input
                  onChange={event =>
                    this.setState({
                      password1: event.target.value
                    })
                  }
                  placeholder="Password"
                  type="password"
                />
                <input
                  onChange={event =>
                    this.setState({
                      password2: event.target.value
                    })
                  }
                  placeholder="Repeat Password"
                  type="password"
                />
                <button
                  type="submit"
                  disabled={
                    this.state.password1 === '' ||
                    this.state.password1 !== this.state.password2
                  }
                >
                  Change
                </button>
              </form>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

const UPDATE_PASSWORD_QUERY = gql`
  mutation updatePassword($token: String!, $password: String!) {
    updatePassword(token: $token, password: $password)
  }
`

export default ChangePassword
