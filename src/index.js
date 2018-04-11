import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { split } from 'apollo-link'

import './index.css'
import Navbar from './components/Navbar'
import Users from './components/Users'
import Subject from './components/Subject'
import Subjects from './components/Subjects'
import User from './components/User'
import Login from './components/Login'
import App from './components/App'
import NotFound from './components/NotFound'
import registerServiceWorker from './registerServiceWorker'
import rootReducer from './reducers'

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql'
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000`,
  options: { reconnect: true }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  // link: new HttpLink({
  //   uri: 'http://localhost:3000/graphql',
  //   credentials: 'same-origin'
  // }),
  // link: httpLink,
  link,
  cache: new InMemoryCache()
})

const store = createStore(rootReducer, applyMiddleware(logger))

ReactDOM.render(
  // <ApolloProvider client={client}>
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <React.Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/user/:id" component={User} />
            <Route exact path="/subject/:id" component={Subject} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/subjects" component={Subjects} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={App} />
            <Route component={NotFound} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
