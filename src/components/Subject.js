import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import CreatePost from './CreatePost'
import { connect } from 'react-redux'
import cookie from 'react-cookies'
import moment from 'moment'

import { GET_SUBJECTS_QUERY } from './Subjects'
import Post from './Post'
import EditSubject from './EditSubject'

export const timestampToDateTime = timestamp =>
  moment
    .unix(timestamp)
    .utc()
    .format('Y-MM-DD, HH:mm:ss')

class Subject extends React.Component {
  state = { editingSubject: false, editingPost: false }

  componentDidMount () {
    this.props.subscribeToNewPosts()
  }

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
    const { data } = this.props
    return (
      <div>
        <h1>Subject</h1>
        <hr />
        {data.subject &&
          (!this.state.editingSubject ? (
            <div>
              <h2>{data.subject.title}</h2>
              <div>{data.subject.message}</div>
              <div>
                <small>{data.subject.author.username}</small>
              </div>
              <div>
                <small>{timestampToDateTime(data.subject.createdAt)}</small>
              </div>
              {data.subject.editedAt && (
                <div>
                  <small>
                    Edited: {timestampToDateTime(data.subject.editedAt)}
                  </small>
                </div>
              )}
              {data.subject.author.username === this.props.username && (
                <div>
                  <button
                    onClick={() =>
                      this.setState({
                        editingSubject: true
                      })
                    }
                  >
                    Edit
                  </button>
                </div>
              )}
              <hr />
            </div>
          ) : (
            <EditSubject
              subjectTitle={data.subject.title}
              subjectId={this.props.match.params.id}
              message={data.subject.message}
              closeEditSubject={() => this.setState({ editingSubject: false })}
            />
          ))}

        {data.subject.responses &&
          data.subject.responses.map(response => (
            <Post
              key={response._id}
              response={response}
              subjectId={this.props.data.subject._id}
            />
          ))}
      </div>
    )
  }
}

// export class Subject extends React.Component {
const SubjectWithData = props => (
  <Mutation
    mutation={DELETE_SUBJECT_QUERY}
    refetchQueries={[{ query: GET_SUBJECTS_QUERY }]}
  >
    {(deleteSubject, _) => {
      return (
        <Query
          query={FETCH_SUBJECT_QUERY}
          variables={{ _id: props.match.params.id }}
        >
          {({ subscribeToMore, ...result }) => {
            if (result.loading) return <div>Loading...</div>
            if (result.error) return <div>{result.data.error.message}</div>
            return (
              <React.Fragment>
                <Subject
                  {...result}
                  subscribeToNewPosts={() => {
                    subscribeToMore({
                      document: SUBSCRIPTION_NEW_RESPONSE,
                      variables: { _id: result.data.subject._id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data.postAdded) return prev

                        const { postAdded } = subscriptionData.data

                        return Object.assign({}, prev, {
                          subject: {
                            ...prev.subject,
                            responses: [...prev.subject.responses, postAdded]
                          }
                        })
                      }
                    })
                  }}
                />
                {props.username && (
                  <CreatePost subjectId={props.match.params.id} />
                )}
                {result.data.subject.author.username ===
                  cookie.load('username') && (
                  <div>
                    <button
                      onClick={event => this.handleDelete(event, deleteSubject)}
                    >
                      Delete Subject
                    </button>
                  </div>
                )}
              </React.Fragment>
            )
          }}
        </Query>
      )
    }}
  </Mutation>
)

export const FETCH_SUBJECT_QUERY = gql`
  query subject($_id: String!) {
    subject(_id: $_id) {
      _id
      title
      message
      createdAt
      editedAt
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

export const SUBSCRIPTION_NEW_RESPONSE = gql`
  subscription onPostAdded($_id: String!) {
    postAdded(_id: $_id) {
      _id
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

export default connect(mapStateToProps)(SubjectWithData)
