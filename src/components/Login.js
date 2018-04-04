import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import cookie from 'react-cookies'

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
    })
  }

  render () {
    return (
      <Mutation mutation={LOGIN_QUERY}>
        {(login, { data, error, loading }) => {
          // console.log(data)
          if (loading) return <div>Loading...</div>
          return (
            <div>
              <h1>Login</h1>
              <form onSubmit={event => this.onSubmit(event, login)}>
                <input
                  placeholder="Username"
                  onChange={event =>
                    this.setState({
                      username: event.target.value
                    })
                  }
                />
                <input
                  placeholder="Password"
                  onChange={event =>
                    this.setState({
                      password: event.target.value
                    })
                  }
                  type="password"
                />
                <button type="submit">Login</button>
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

const mapDispatchToProps = dispatch => ({
  login: username =>
    dispatch({
      type: 'LOGIN',
      payload: { username }
    })
})

export default connect(undefined, mapDispatchToProps)(Login)
