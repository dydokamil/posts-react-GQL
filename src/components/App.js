import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import logo from './logo.svg'
import './App.css'
import Users from './Users'

class App extends React.Component {
  render () {
    return <Users />
  }
}

export default App
