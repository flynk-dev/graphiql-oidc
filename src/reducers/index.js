import { reducer as oidcReducer } from 'redux-oidc';
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  routing: routerReducer,
  oidc: oidcReducer,
})
