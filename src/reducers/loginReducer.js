import cookie from 'react-cookies'

const INITIAL_STATE = { username: cookie.load('username') }

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { username: action.payload.username }
    case 'LOGOUT':
      return { username: '' }
    default:
      return state
  }
}

export default loginReducer
