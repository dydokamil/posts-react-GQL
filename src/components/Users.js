import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import CreateUser from './CreateUser'

class Users extends React.Component {
  componentDidMount() {
    console.log('From Users.js', this.props)
  }

  componentWillReceiveProps = newProps => {
    console.log(newProps)
  }

  render() {
    return (
      <div>
        <h1>Users</h1>
        <div>{this.props.data.loading && <div>Loading users...</div>}</div>
        <div>{this.props.data.error && <div>{this.props.data.error}</div>}</div>
        <div>
          {this.props.data.users && (
            <ul>
              {this.props.data.users.map(user => <li>{user.username}</li>)}
            </ul>
          )}
        </div>
        <CreateUser />
      </div>
    )
  }
}

const GET_USERS_QUERY = gql`
  {
    users {
      _id
      username
      createdAt
    }
  }
`

export default graphql(GET_USERS_QUERY)(Users)
