import React from 'react';
import GraphiQL from 'graphiql';
import { useSelector } from 'react-redux'
import 'graphiql/graphiql.css';
import { userManager } from './index';

const graphQLFetcher = graphQLParams => {
  return userManager.getUser().then(usr => {
    return fetch('http://spot.local:8080/graphql', {
      method: "post",
      headers: { 
        "Content-Type": "application/json", 
        'Authorization': 'Bearer ' + usr.access_token 
      },
      credentials: 'include',
      body: JSON.stringify(graphQLParams)
    }).then(response => {
      if (response.status === 401 || response.status === 0) {
        throw new Error('log eerst maar eens in');
      }
      return response.json();
    })
  });
}

const handleClick = () => {
    userManager.signinRedirect();
}

const Login = () => {
  return (
    <div className={'login'}>
      <button className={'cupid-green'} onClick={handleClick}>{'Login'}</button>
    </div>
  )
}

const App = () => {
  const oidc = useSelector(state => state.oidc);
  if (oidc.isLoadingUser) {
    return (<h1>loading user...</h1>)
  }
  if (oidc.user === null) {
    return (<Login />)
  }
  return (
      <GraphiQL fetcher={graphQLFetcher} />
  );
}

export default App;
