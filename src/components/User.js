import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import cookie from 'react-cookies'

import './User.css'
import { timestampToDateTime } from './Subject'
import ChangePassword from './ChangePassword'

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
          return (
            <div className="user-page">
              <h1>User {data.user.username}</h1>
              <div>Email: {data.user.email}</div>
              <div>Created: {timestampToDateTime(data.user.createdAt)}</div>
              {data.user.lastLogin && (
                <div>
                  Last login: {timestampToDateTime(data.user.lastLogin)}
                </div>
              )}
              {data.user.posts &&
                data.user.posts.length > 0 && (
                <div>
                  <h2>Posts</h2>
                  <ul>
                    {data.user.posts.map(post => (
                      <li key={post._id}>{post.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.user.subjects &&
                data.user.subjects.length > 0 && (
                <div>
                  <h2>Subjects</h2>
                  <ul>
                    {data.user.subjects.map(subject => (
                      <li key={subject._id}>
                        <Link to={`/subject/${subject._id}`}>
                          {subject.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cookie.load('username') === data.user.username && (
                <ChangePassword />
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
      lastLogin
      posts {
        message
        _id
      }
      subjects {
        _id
        title
      }
    }
  }
`

export default User
