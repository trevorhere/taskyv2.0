import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import query from '../gql/queries/CurrentUser';
import mutation from '../gql/mutations/Logout';

const titleStyle={
  fontWeight: "100",
  paddingLeft:"20px"
}

class Header extends Component {
  onLogoutClick() {
    this.props.mutate({
      refetchQueries: [{ query }]
    });

    this.props.history.pushState('/login');
  }

  renderButtons(){
    const {loading, user} = this.props.data;

    if(loading){
      return <div />
    }

    if(user){
      return (
        <div>
          <li>
            <Link to={`/sms_instructions`}> SMS</Link>
          </li>
          <li>
            <Link to={`/dashboard`}> Dashboard</Link>
          </li>
          <li>
            <Link onClick={this.onLogoutClick.bind(this)}  to="/login" >Logout</Link>
          </li>
        </div>
      )
    }
    return (
      <div>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </div>
    )
  }
  render(){
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to="/" style={titleStyle} className="brand-logo left">T A S K Y V</Link>
          <ul className="right">
            {this.renderButtons()}
          </ul>
        </div>
      </nav>
    );
  }
}

export default graphql(mutation)(
    graphql(query)(Header)
);