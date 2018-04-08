import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import CreateSubject from './CreateSubject'

export class Subjects extends React.Component {
  render () {
    return (
      <Query query={GET_SUBJECTS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error) return <div>{error.message}</div>
          return (
            <div>
              <h1>Subjects</h1>
              {data.subjects && (
                <ul>
                  {data.subjects.map(subject => (
                    <li key={subject._id}>
                      <Link to={`/subject/${subject._id}`}>
                        {subject.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {this.props.username && <CreateSubject />}
            </div>
          )
        }}
      </Query>
    )
  }
}

export const GET_SUBJECTS_QUERY = gql`
  {
    subjects {
      _id
      title
      message
      createdAt
      editedAt
      author {
        _id
        username
      }
    }
  }
`

const mapStateToProps = state => ({
  username: state.loginReducer.username
})

export default connect(mapStateToProps)(Subjects)
