import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import {  Redirect } from 'react-router-dom';
import currentUserQuery from '../gql/queries/CurrentUser';


export default (WrappedComponent) => {
class RequireAuth extends Component {
  render(){
  if(!this.props.data.user && !this.props.data.loading){
    return (
      <Redirect to={{pathname: '/login'}}/>
    )
  }
    return <WrappedComponent {...this.props} />;
  }
}

return graphql(currentUserQuery)(RequireAuth);
};