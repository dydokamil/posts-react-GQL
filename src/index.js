import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
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
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
