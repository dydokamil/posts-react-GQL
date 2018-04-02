import React from 'react'
import gql from 'graphql-tag'
import { graphql, Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'

import CreateUser from './CreateUser'

class Users extends React.Component {
  componentDidMount = () => {
    console.log(this.props)
  }
  render () {
    return (
      <div>
        <h1>Users</h1>
        <div>{this.props.data.loading && <div>Loading users...</div>}</div>
        <div>{this.props.data.error && <div>{this.props.data.error}</div>}</div>
        <div>
          {this.props.data.users && (
            <ul>
              {this.props.data.users.map(user => (
                <li key={user._id}>
                  <Link to={`/user/${user._id}`}>
                    {user.username} (email: {user.email})
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
