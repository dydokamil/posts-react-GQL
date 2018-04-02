import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

import './index.css'
import Navbar from './components/Navbar'
import Users from './components/Users'
import User from './components/User'
import Login from './components/Login'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

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

ReactDOM.render(
  <ApolloProvider client={client}>
    <CookiesProvider>
      <BrowserRouter>
        <React.Fragment>
          <Navbar />
          <Switch>
            <Route path="/user/:id" component={User} />
            <Route path="/users" component={Users} />
            <Route path="/login" component={Login} />
            <Route path="/" component={App} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    </CookiesProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
