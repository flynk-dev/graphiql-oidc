import React from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import './App.css';
import { userManager } from './index';


function graphQLFetcher(graphQLParams) {
  return userManager.getUser().then(usr => {
    return fetch('http://hoelahoep.local:8080/graphql', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usr.access_token
      }),
      // mode: 'no-cors',
      body: JSON.stringify(graphQLParams),
    }).then(response => {
      console.log("resp" + response.status);
      if (response.status === 401 || response.status === 0) {
        throw new Error('log eerst maar eens in');
      }
      response.json()
    }).catch(error => {
      console.log("FOUT,", error);
      //userManager.signinRedirect();    
    })
  })
};

function handleClick() {
  userManager.signinRedirect();
}

function App() {
  return (
    <div className="App">
      <button onClick={handleClick}>Login</button>
      <GraphiQL style={{ height: '100vh' }} fetcher={graphQLFetcher} />
    </div>
  );
}

export default App;
