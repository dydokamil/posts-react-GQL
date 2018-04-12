import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import cookie from 'react-cookies'

import './Login.css'

class Login extends React.Component {
  state = { username: '', password: '' }

  onSubmit = (event, login) => {
    event.preventDefault()

    const { username, password } = this.state

    login({
      variables: {
        username,
        password
      }
    }).then(res => {
      const { token, username } = res.data.login
      cookie.save('token', token, { path: '/' })
      cookie.save('username', username, { path: '/' })

      this.props.login(username)
      this.props.history.goBack()
    })
  }

  render () {
    if (this.props.username) {
      return <h3>You are already logged in.</h3>
    }
    return (
      <Mutation mutation={LOGIN_QUERY}>
        {(login, { data, error, loading }) => {
          if (loading) return <div>Loading...</div>
          return (
            <div className="login-page">
              <h1>Login</h1>
              <form
                className="inline"
                onSubmit={event => this.onSubmit(event, login)}
              >
                <div className="form-control">
                  <input
                    className="full-width"
                    placeholder="Username"
                    onChange={event =>
                      this.setState({
                        username: event.target.value
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <input
                    className="full-width"
                    placeholder="Password"
                    onChange={event =>
                      this.setState({
                        password: event.target.value
                      })
                    }
                    type="password"
                  />
                </div>
                <button className="action-button" type="submit">
                  Login
                </button>
              </form>
              {error && <div>{error.message}</div>}
            </div>
          )
        }}
      </Mutation>
    )
  }
}

const LOGIN_QUERY = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      username
    }
  }
`

const mapStateToProps = state => ({
  username: state.loginReducer.username
})

const mapDispatchToProps = dispatch => ({
  login: username =>
    dispatch({
      type: 'LOGIN',
      payload: { username }
    })
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
