import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import query from '../gql/queries/fetchUser';
import Loading from './Loading';

const style = {
     border:'2px solid grey',
     padding: '10px',
     marginTop: '20px'
}

class ViewUser extends Component{

  renderLists(lists){
   return  lists.map(({id, name}) => {
      return (
        <li key={id}>{name}</li>
      )
    })
  }

  render(){
    console.log(this.props);
    const { userID } = this.props.data;
    if (!userID) { return (<Loading loading={userID}/>); }

    return (
      <div className="container">
          <h3>User Profile:</h3>
          Name: {userID.name}
          <br/>
          email: {userID.email}
          <br/>
          Position: {userID.position}
          <br/>
          <div>
            {userID.lists.length ? <div>
            <ul>
              Lists:
              {this.renderLists(userID.lists)}
            </ul>
            </div> : <div></div>}
          </div>
          <div style={{marginTop: "10px"}}>
          <Link
          to={`/dashboard/team/${this.props.match.params.teamID}`}
          style={{margin: "10px"}}
          className=" btn-large red right">Back</Link>
          </div>
        </div>
      );

  }
}

export default graphql(query, {
  options: (props) => { return { variables: { userID: props.match.params.userID}}},
})(ViewUser);


