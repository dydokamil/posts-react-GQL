import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import CreatePost from './CreatePost'

export class Subject extends React.Component {
  render () {
    console.log(this.props)
    return (
      <Query
        query={FETCH_SUBJECT_QUERY}
        variables={{ _id: this.props.match.params.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error) return <div>{error.message}</div>
          console.log(data)

          return (
            <div>
              <h1>Subject</h1>
              <hr />

              {data.subject && (
                <div>
                  <h2>{data.subject.title}</h2>
                  <div>{data.subject.message}</div>
                  <small>{data.subject.createdAt}</small>
                  <hr />
                  {data.subject.responses &&
                    data.subject.responses.map(response => (
                      <div key={response._id}>
                        <div>{response.message}</div>
                        <div>
                          <small>{response.author.username}</small>
                        </div>
                        <div>
                          <small>{response.createdAt}</small>
                        </div>

                        <hr />
                      </div>
                    ))}
                </div>
              )}
              <CreatePost subjectId={this.props.match.params.id} />
            </div>
          )
        }}
      </Query>
    )
  }
}

export const FETCH_SUBJECT_QUERY = gql`
  query subject($_id: String!) {
    subject(_id: $_id) {
      _id
      title
      message
      createdAt
      responses {
        _id
        message
        author {
          _id
          username
        }
        createdAt
        editedAt
      }
    }
  }
`

export default Subject
