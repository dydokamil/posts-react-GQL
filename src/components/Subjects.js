import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { SUBSCRIPTION_DELETE_SUBJECT } from './Subject'
import CreateSubject from './CreateSubject'
import './Subjects.css'

class Subjects extends React.Component {
  componentDidMount () {
    this.props.subscribeToNewSubjects()
    this.props.subscribeToDeleteSubject()
  }

  render () {
    return (
      <div className="subjects">
        <h1>Subjects</h1>
        {this.props.data.subjects && this.props.data.subjects.length ? (
          <ul>
            {this.props.data.subjects.map(subject => (
              <li key={subject._id}>
                <Link to={`/subject/${subject._id}`}>{subject.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <h2>No subjects.</h2>
        )}
      </div>
    )
  }
}

const SubjectsWithData = props => (
  <Query query={GET_SUBJECTS_QUERY}>
    {({ subscribeToMore, ...result }) => (
      <React.Fragment>
        <Subjects
          {...result}
          subscribeToNewSubjects={() =>
            subscribeToMore({
              document: SUBSCRIBE_CREATE_SUBJECT,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.subjectAdded) {
                  return prev
                }

                let newSubject = subscriptionData.data.subjectAdded

                return Object.assign({}, prev, {
                  subjects: [...prev.subjects, newSubject]
                })
              }
            })
          }
          subscribeToDeleteSubject={() => {
            subscribeToMore({
              document: SUBSCRIPTION_DELETE_SUBJECT,
              updateQuery: (prev, { subscriptionData }) => {
                // console.log(subscriptionData)
                if (!subscriptionData.data.subjectDeleted) return prev

                const { subjectDeleted } = subscriptionData.data

                return Object.assign({}, prev, {
                  subjects: prev.subjects.filter(
                    subject => subject._id !== subjectDeleted._id
                  )
                })
              }
            })
          }}
        />
        {props.username && <CreateSubject />}
      </React.Fragment>
    )}
  </Query>
)

export const GET_SUBJECTS_QUERY = gql`
  {
    subjects {
      title
      _id
    }
  }
`

export const SUBSCRIBE_CREATE_SUBJECT = gql`
  subscription subjectAdded {
    subjectAdded {
      title
      _id
    }
  }
`

const mapStateToProps = state => ({
  username: state.loginReducer.username
})

export default connect(mapStateToProps)(SubjectsWithData)
