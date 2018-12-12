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
      position: '',
      phoneNumber: ''
    }
  }

  onSubmit(event){
    event.preventDefault();
    const {email, password, name, position, phoneNumber} = this.state;
    this.props.CreateUser({
      variables: {email, password, name, position, phoneNumber, teamID:this.props.match.params.teamID },
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
      <div  style={{color: "#9D9C9D"}} className="container">
      <div>
      <h3  className="section-title">Create User</h3>
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
          placeholder="Phone Number - country code included, i.e: '+1'"
          value={this.state.phoneNumber}
          onChange={e => this.setState({
            phoneNumber: e.target.value
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
        <button className="waves-effect waves-light right btn-medium outline " style={{margin: "10px"}} type="submit" value="Submit" >Submit</button>
          <Link style={{margin: "10px"}} className="outline right" to={`/dashboard/list/${this.props.match.params.teamID}`}>Cancel</Link>
      </form>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <h3  className="section-title">Invite Existing User</h3>
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
          <button className="waves-effect waves-light right btn-medium outline " style={{margin: "10px"}} type="submit" value="Submit" >Submit</button>
          <Link style={{margin: "10px"}} className="outline right" to={`/dashboard/list/${this.props.match.params.teamID}`}>Cancel</Link>
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
