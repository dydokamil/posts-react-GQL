import React from 'react'
import { Query, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import CreateSubject from './CreateSubject'

class Subjects extends React.Component {
  componentDidMount () {
    this.props.subscribeToNewSubjects()
  }

  render () {
    return (
      <div>
        <h1>Subjects</h1>
        {this.props.data.subjects && (
          <ul>
            {this.props.data.subjects.map(subject => (
              <li key={subject._id}>
                <Link to={`/subject/${subject._id}`}>{subject.title}</Link>
              </li>
            ))}
          </ul>
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
