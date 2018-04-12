import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'

import './Users.css'
import CreateUser from './CreateUser'

class Users extends React.Component {
  render () {
    return (
      <div className="users">
        <h1>Users</h1>
        <div>{this.props.data.loading && <div>Loading users...</div>}</div>
        <div>{this.props.data.error && <div>{this.props.data.error}</div>}</div>
        <div>
          {this.props.data.users &&
            this.props.data.users.map(user => (
              <div key={user._id}>
                <Link to={`/user/${user._id}`}>
                  {user.username} (email: {user.email})
                </Link>
                <hr />
              </div>
            ))}
        </div>
        <CreateUser />
      </div>
    )
  }
}

export const GET_USERS_QUERY = gql`
  {
    users {
      _id
      username
      email
      createdAt
    }
  }
`

export default graphql(GET_USERS_QUERY)(Users)
