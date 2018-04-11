import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import CreatePost from './CreatePost'
import { connect } from 'react-redux'
import cookie from 'react-cookies'
import moment from 'moment'

import './Subject.css'
import './Common.css'
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
    this.props.subscribeToPostDeletion()
    this.props.subscribeToPostEdit()
    this.props.subscribeToSubjectEdit()
    this.props.subscribeToDeleteSubject()
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
      <div className="subject">
        <h1>Subject</h1>
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
                    className="edit-button"
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
        {this.props.data.subject.author.username ===
          cookie.load('username') && (
          <div>
            <button
              className="delete-button full-width"
              onClick={event =>
                this.handleDelete(event, this.props.deleteSubject)
              }
            >
              Delete Subject
            </button>
          </div>
        )}
        {this.props.username && (
          <div>
            <h3>Respond</h3>
            <CreatePost subjectId={this.props.match.params.id} />
          </div>
        )}
      </div>
    )
  }
}

const SubjectWithData = props => (
  <Mutation mutation={DELETE_SUBJECT_QUERY}>
    {(deleteSubject, _) => {
      return (
        <Query
          query={FETCH_SUBJECT_QUERY}
          variables={{ _id: props.match.params.id }}
        >
          {({ subscribeToMore, ...result }) => {
            if (result.loading) return <div>Loading...</div>
            if (result.error) return <div>{result.data.error.message}</div>
            if (!result.data.subject) {
              return <h2>Subject not found. It might have been deleted.</h2>
            }

            return (
              <React.Fragment>
                <Subject
                  {...props}
                  {...result}
                  deleteSubject={deleteSubject}
                  subscribeToPostDeletion={() => {
                    subscribeToMore({
                      document: SUBSCRIPTION_DELETE_POST,
                      variables: { subjectId: result.data.subject._id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data.postDeleted) return prev

                        const { postDeleted } = subscriptionData.data
                        const { responses } = prev.subject

                        return Object.assign({}, prev, {
                          subject: {
                            ...prev.subject,
                            responses: responses.filter(
                              response => response._id !== postDeleted._id
                            )
                          }
                        })
                      }
                    })
                  }}
                  subscribeToNewPosts={() => {
                    subscribeToMore({
                      document: SUBSCRIPTION_NEW_RESPONSE,
                      variables: { subjectId: result.data.subject._id },
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
                  subscribeToPostEdit={() => {
                    subscribeToMore({
                      document: SUBSCRIPTION_EDIT_POST,
                      variables: { subjectId: result.data.subject._id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data.postEdited) return prev

                        const { postEdited } = subscriptionData.data
                        const toEditIndex = prev.subject.responses.findIndex(
                          response => response._id === postEdited._id
                        )

                        if (toEditIndex === -1) return prev

                        return Object.assign({}, prev, {
                          subject: {
                            ...prev.subject,
                            responses: [
                              ...prev.subject.responses.slice(0, toEditIndex),
                              postEdited,
                              ...prev.subject.responses.slice(toEditIndex + 1)
                            ]
                          }
                        })
                      }
                    })
                  }}
                  subscribeToSubjectEdit={() => {
                    subscribeToMore({
                      document: SUBSCRIPTION_EDIT_SUBJECT,
                      variables: { subjectId: result.data.subject._id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data.subjectEdited) return prev

                        const { subjectEdited } = subscriptionData.data

                        return Object.assign({}, prev, {
                          subject: {
                            ...prev.subject,
                            ...subjectEdited
                          }
                        })
                      }
                    })
                  }}
                  subscribeToDeleteSubject={() => {
                    subscribeToMore({
                      document: SUBSCRIPTION_DELETE_SUBJECT,
                      variables: { subjectId: result.data.subject._id },
                      updateQuery: (prev, { subscriptionData }) => {
                        console.log(subscriptionData)
                        if (!subscriptionData.data.subjectDeleted) return prev

                        const { subjectDeleted } = subscriptionData.data

                        if (subjectDeleted._id === prev.subject._id) {
                          return Object.assign({}, prev, { subject: null })
                        }
                      }
                    })
                  }}
                />
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
  subscription onPostAdded($subjectId: String!) {
    postAdded(subjectId: $subjectId) {
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

export const SUBSCRIPTION_DELETE_POST = gql`
  subscription onPostDeleted($subjectId: String!) {
    postDeleted(subjectId: $subjectId) {
      _id
    }
  }
`

export const SUBSCRIPTION_EDIT_POST = gql`
  subscription onPostEdit($subjectId: String!) {
    postEdited(subjectId: $subjectId) {
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

export const SUBSCRIPTION_EDIT_SUBJECT = gql`
  subscription onSubjectEdit($subjectId: String!) {
    subjectEdited(subjectId: $subjectId) {
      _id
      message
      editedAt
    }
  }
`

export const SUBSCRIPTION_DELETE_SUBJECT = gql`
  subscription onSubjectDelete($subjectId: String) {
    subjectDeleted(subjectId: $subjectId) {
      _id
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
