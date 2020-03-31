import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { OidcProvider } from 'redux-oidc';
import rootReducer from './reducers'
import './index.css';
import App from './App'
import { createUserManager } from 'redux-oidc';
import { loadUser } from 'redux-oidc';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import CallbackPage from './callback';
import { createStore, applyMiddleware, compose } from "redux";
import { createHashHistory } from 'history';
import { routerMiddleware } from "react-router-redux";

let um;
export const userManager = () => um;

let gu;
export const gqlUrl = () => gu;

const root = window.location.origin;
const appConfigPath = `${root}/config.json`;

fetch(appConfigPath, { cache: 'no-cache' })
  .then(response => response.json())
  .then(config => {
    gu = config.graphql_url || 'http://localhost:8080/graphql';

    const settings = {
      client_id: 'graphiql',
      redirect_uri: `${window.location.href}callback`,
      response_type: 'token id_token',
      scope: 'openid',
      authority: config.authority_url || 'http://localhost:5556/dex',
      silent_redirect_uri: `${window.location.href}silent_renew.html`,
      automaticSilentRenew: true,
      filterProtocolClaims: true,
      loadUserInfo: false //,
      //issuer: 'http://localhost:28080/dex',
      //signingKeys : {"keys":[{"kty":"RSA","e":"AQAB","kid":"0c414246-34fe-4ebc-9050-f61875321ffc","n":"5NsfmKPzKfc4_pMcVHP_huLkQ-S_i-RAwtU-CI4dgPpOM83O4FeC61AXvsgJA6wgk26OBy4HhSW1ZwzECSJ-4KuZiynsCTeW9ZgftGJc88d2CMBPYVQVWd_VWxV6HuBSbnBV72zWX80rzqbYi5XyMCUwXAVS5X9nmNmJpOoau1Ia0V83RmJROAbiTBM3h9J5XuiGtpk3pnMiwcOs_GHB8tRWQn_Hlk0pl2_2WSEaolhW-GOS9q2OMs9-AjuXMc6e_95dKgnhvp0eEAZPvXNX9Mmkp3MGpWCbQVJQ6oi_gXbssIDikkGJNfwfwzRkbCDclORvsxeWy_0rXGOUna59uZtPBkNTXBKtg1WdJJIScF-HSz0STllRqxgHGmpwKeBDdUR6ijYuue0lZNNKibnVDVCgMKtZM9fEAYjed1zX2B4Cw8HVG-tNGJEwDnFPQ5y7Y4JtkylY1jWLIawORxkN1JVxXubtusnugTz5JptQsdphJ87da1NuFyQoT4Be-kJ1--Pjx1JeObxdQkkLC6kRW8VQTZ_NArWWzQ9BijhzRaipBC13XquNr5LIHVqjSmAYhDNRamNxzyt7wZCUfrPMtY7G0EZaM9YUkE5aLFp7WVy4avSsPQ13sSc43z4zCNUYb0BAlCKOFC9elFQYY84wHSHAwVf9CHnzbiUjC0P93L8"}]},
      //authorization_endpoint : 'https://sst-auth.flynk.de'
    };

    um = createUserManager(settings);

    const initialState = {
      config
    };

    const createStoreWithMiddleware = compose(
      applyMiddleware(routerMiddleware(createHashHistory))
    )(createStore);

    const store = createStoreWithMiddleware(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    loadUser(store, userManager());
  
    render(
      <Provider store={store}>
        <OidcProvider userManager={userManager()} store={store}>
        <Router>
          <Route path="/" component={App} />
          <Route path="/callback" component={CallbackPage} />
        </Router>
        </OidcProvider>
      </Provider>,
      document.getElementById('graphiql')
    )
});
