import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import query from '../gql/queries/Dashboard';
import Loading from './Loading';
import '../styles/App.css';

class Dashboard extends Component {

  renderList(items, link){
    return items.map(({id, name}) => {
      return (
      <li key={id} className="collection-item">
        <Link to={`/dashboard/${link}/${id}`}>{name}</Link>
      </li>
      );
    });
  }
  render(){
    if(this.props.data.loading){
      return ( <Loading loading={this.props.data.loading} /> )
    }
    const { teams, lists } = this.props.data.user;
    return (
      <div className="container">
        <div >
          <h3 className="section-title">Your Lists: </h3>
          <ul className="collection">
            {this.renderList(lists, "list")}
          </ul>
          <Link
            to="/dashboard/createlist"
            className="btn-large red right">
            Create List
          </Link>
        </div>
        <div style={{height: "100px"}}/>
        <div >
          <h3 className="section-title">Your Teams: </h3>
          <ul className="collection">
            {this.renderList(teams, "team")}
          </ul>
          <br/>
          <br/>
          <Link
            to="/dashboard/createteam"
            className="btn-flyou are logged inating btn-large red right">
             Create Team
          </Link>
        </div>
      </div>
    )
  }
}

export default graphql(query)(Dashboard);