import React, {Component} from 'react';
import {graphql, compose } from 'react-apollo';
import createUser from '../gql/mutations/CreateUser';
import existingUserToTeam from '../gql/mutations/ExistingUserToTeam';
import query from '../gql/queries/fetchTeam';
import { Link } from 'react-router-dom';


class CreateUser extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: '',
      name: '',
      position: ''
    }
  }

  onSubmit(event){
    event.preventDefault();
    const {email, password, name, position} = this.state;
    this.props.CreateUser({
      variables: {email, password, name, position, teamID:this.props.match.params.teamID },
      refetchQueries: [{ query }]
    })

    this.props.history.push(`/dashboard/team/${this.props.match.params.teamID}`);

  }

  findExistingUser(event){
    event.preventDefault();
    this.props.ExistingUserToTeam({
      variables: {email: this.state.email ,teamID: this.props.match.params.teamID},
      refetchQueries: [{ query }]
    })

    this.props.history.push(`/dashboard/team/${this.props.match.params.teamID}`);

  }

  render(){
    return (
      <div className="container">
      <div>
      <h3>Create User</h3>
      <form onSubmit={this.onSubmit.bind(this)} className="col s6">
        <div className="input-field">
        <input
          placeholder="email"
          value={this.state.email}
          onChange={e => this.setState({
            email: e.target.value
          })}
        />
           <input
          placeholder="Name"
          value={this.state.name}
          onChange={e => this.setState({
            name: e.target.value
          })}
        />
           <input
          placeholder="Position/Title"
          value={this.state.position}
          onChange={e => this.setState({
            position: e.target.value
          })}
        />
        </div>
        <div className="input-field">
        <input
          type="password"
          placeholder="password"
          value={this.state.password}
          onChange={e => this.setState({
            password: e.target.value
          })}
        />
        </div>
        <input className="btn-large red right" style={{margin: "10px"}} type="submit" value="Submit" />
      <Link style={{margin: "10px"}} className="btn-flyou are logged inating btn-large red right" to={`/dashboard/team/${this.props.match.params.teamID}`}>Cancel</Link>

      </form>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <hr/>
      <h3>Invite Existing User</h3>
      <form onSubmit={this.findExistingUser.bind(this)} className="col s6">
      <div className="input-field">
      <input
          placeholder="email"
          value={this.state.email}
          onChange={e => this.setState({
            email: e.target.value
          })}
        />
        </div>
        <input className="btn-large red right" style={{margin: "10px"}} type="submit" value="Submit" />
      <Link style={{margin: "10px"}} className="btn-flyou are logged inating btn-large red right" to={`/dashboard/team/${this.props.match.params.teamID}`}>Cancel</Link>

        </form>
    </div>
    </div>
    )
  }
}


export default compose(
  graphql(existingUserToTeam, {name: "ExistingUserToTeam"}),
  graphql(createUser, {name: "CreateUser"}),
  )(CreateUser)
