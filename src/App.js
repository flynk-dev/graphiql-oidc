import React from 'react';
import GraphiQL from 'graphiql';
import { useSelector } from 'react-redux'
import './App.css';
import { userManager } from './index';


const graphQLFetcher = graphQLParams => {
  return userManager.getUser().then(usr => {
    return fetch('http://spot.local:8080/graphql', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usr.access_token
      }),
      // mode: 'cors',
      body: JSON.stringify(graphQLParams),
    }).then(response => {
      // console.log("resp" + response.status);
      if (response.status === 401 || response.status === 0) {
        throw new Error('log eerst maar eens in');
      }
      response.text();
    }).then(body => {
      try {
          return JSON.parse(body);
      } catch (error) {
          return body;
      }
    })
    .catch(error => {
      console.log("FOUT,", error);
      //userManager.signinRedirect();    
    })
  })
};

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
  return (
    <div className="App">
      <button onClick={handleClick}>{isAuthenticated ? 'Logout' : 'Login'}</button>
      {isAuthenticated && 
        <GraphiQL style={{ height: '100vh' }} fetcher={graphQLFetcher} />
      }
    </div>
  );
}

export default App;
