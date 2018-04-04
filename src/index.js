import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'

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

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3000/graphql',
    credentials: 'same-origin'
  }),
  cache: new InMemoryCache()
  // cache: new InMemoryCache({
  //   dataIdFromObject: object => {
  //     switch (object.__typename) {
  //       case 'User':
  //         console.log('LOOK HERE', object)
  //         return object._id
  //       default:
  //         return defaultDataIdFromObject(object)
  //     }
  //   }
  // })
})

const store = createStore(rootReducer, applyMiddleware(logger))

ReactDOM.render(
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
