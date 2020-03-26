import { reducer as oidcReducer } from 'redux-oidc';
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';
// import { connectRouter } from 'connected-react-router'


export default combineReducers({
  routing: routerReducer,
  oidc: oidcReducer,
})

// const createRootReducer = (history) => combineReducers({
//   router: connectRouter(history),
//   oidc: oidcReducer,
// })
// export default createRootReducer