import React from "react";
import { CallbackComponent } from "redux-oidc";
import { userManager } from '../index';

const CallbackPage = () => {
  return (
    <CallbackComponent
      userManager={userManager()}
      successCallback={() => {
        window.location.href = '/';
      }}
      errorCallback={error => {
        // this.props.dispatch(push("/"));
        console.error(error);
      }}
      >
      <div>Redirecting...</div>
    </CallbackComponent>
  );
}

export default CallbackPage;