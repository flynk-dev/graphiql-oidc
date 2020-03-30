import React from 'react';
import GraphiQL from 'graphiql';
import { useSelector } from 'react-redux'
import 'graphiql/graphiql.css';
import { userManager } from './index';

function graphQLFetcher(graphQLParams) {
  return userManager.getUser().then(usr => {
  return fetch('http://spot.local:8080/graphql', {
    method: "post",
    headers: { 
      "Content-Type": "application/json", 
      'Authorization': 'Bearer ' + usr.access_token 
    },
    body: JSON.stringify(graphQLParams)
  }).then(response => {
    if (response.status === 401 || response.status === 0) {
      throw new Error('log eerst maar eens in');
    }
    return response.json();
  }).catch(error => {
    console.log("FOUT,", error);
  });
})
}

const handleClick = () => {
  return userManager.getUser().then(usr => {
    if (usr === null) {
      userManager.signinRedirect();
    } else {
      userManager.signoutRedirect();
    }
  });
}

const App = () => {
  const user = useSelector(state => state.oidc.user);
  const isAuthenticated = user !== null;
  if (user === null) {
    return (
    <div className="App">
      <button onClick={handleClick}>{isAuthenticated ? 'Logout' : 'Login'}</button>
    </div>
    )
  }
  return (
      <GraphiQL fetcher={graphQLFetcher} />
  );
}

export default App;
