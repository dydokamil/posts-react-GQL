import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

export class User extends React.Component {
  render () {
    return (
      <Query
        query={FETCH_USER_QUERY}
        variables={{ _id: this.props.match.params.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <div>Loading user...</div>
          if (error) return <div>An error has occured.</div>
          console.log(this.props)
          return (
            <div>
              <h1>User {data.user.username}</h1>
              <div>Email: {data.user.email}</div>
              <div>Created: {data.user.createdAt}</div>
              {data.user.posts &&
                data.user.posts.length > 0 && (
                <div>
                  <h2>Posts</h2>
                  <ul>
                    {data.user.posts.map(post => <li>{post.title}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )
        }}
      </Query>
    )
  }
}

export const FETCH_USER_QUERY = gql`
  query user($_id: String!) {
    user(_id: $_id) {
      _id
      username
      email
      createdAt
      posts {
        message
        _id
      }
    }
  }
`

export default User
