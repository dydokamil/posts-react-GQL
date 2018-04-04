import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import CreatePost from './CreatePost'
import { connect } from 'react-redux'
import cookie from 'react-cookies'

import { GET_SUBJECTS_QUERY } from './Subjects'
import Post from './Post'

export class Subject extends React.Component {
  handleDelete = (event, deleteSubject) => {
    event.preventDefault()

    deleteSubject({
      variables: {
        subjectId: this.props.match.params.id,
        token: cookie.load('token')
      }
    })
    this.props.history.push('/subjects')
  }

  render () {
    return (
      <Mutation
        mutation={DELETE_SUBJECT_QUERY}
        refetchQueries={[{ query: GET_SUBJECTS_QUERY }]}
      >
        {(deleteSubject, _) => {
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
                        <div>
                          <small>{data.subject.author.username}</small>
                        </div>
                        <div>
                          <small>{data.subject.createdAt}</small>
                        </div>
                        <hr />
                        {data.subject.responses &&
                          data.subject.responses.map(response => (
                            <Post
                              response={response}
                              subjectId={this.props.match.params.id}
                            />
                          ))}
                      </div>
                    )}
                    {this.props.username && (
                      <CreatePost subjectId={this.props.match.params.id} />
                    )}
                    {data.subject.author.username ===
                      cookie.load('username') && (
                      <div>
                        <button
                          onClick={event =>
                            this.handleDelete(event, deleteSubject)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )
              }}
            </Query>
          )
        }}
      </Mutation>
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
      author {
        _id
        username
      }
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

export const DELETE_SUBJECT_QUERY = gql`
  mutation deleteSubject($subjectId: String!, $token: String!) {
    deleteSubject(subjectId: $subjectId, token: $token) {
      _id
    }
  }
`

const mapStateToProps = state => ({
  username: state.loginReducer.username
})

export default connect(mapStateToProps)(Subject)
