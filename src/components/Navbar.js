import React from 'react'
import { Link } from 'react-router-dom'
import cookie from 'react-cookies'
import { connect } from 'react-redux'

import './Navbar.css'

class Navbar extends React.Component {
  INITIAL_STATE = { username: '' }
  state = this.INITIAL_STATE

  static getDerivedStateFromProps (nextProps, prevState) {
    return { username: nextProps.username }
  }

  logout = () => {
    cookie.remove('token', { path: '/' })
    cookie.remove('username', { path: '/' })

    this.props.logout()
  }

  render () {
    return (
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/subjects">Subjects</Link>
        {!this.state.username ? (
          <Link to="/login">Login</Link>
        ) : (
          <React.Fragment>
            <span>Hello, {this.state.username}</span>
            <button className="link-button" onClick={this.logout}>
              Logout
            </button>
          </React.Fragment>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  username: state.loginReducer.username
})

const mapDispatchToProps = dispatch => ({
  logout: () =>
    dispatch({
      type: 'LOGOUT'
    })
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
