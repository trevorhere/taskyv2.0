import React, {Component} from 'react';
import { graphql } from 'react-apollo';
import query from '../gql/queries/CurrentUser';
import mutation from '../gql/mutations/Signup';

class SignupForm extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: '',
      name: '',
      position: '',
      phoneNumber: '',
    }
  }

  onSubmit(event){
    event.preventDefault();
    const {email, password, name, position, phoneNumber} = this.state;
    this.props.mutate({
      variables: {email, password, name, position, phoneNumber},
      refetchQueries: [{ query }]
    })

    this.props.history.push('/dashboard');

  }

  render(){
    return (
      <div style={{color: "#9D9C9D"}} className="container">
      <h3 className="section-title">Signup</h3>
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
        <button className="waves-effect waves-light right btn-medium outline">Submit</button>
      </form>
    </div>
    )
  }
}

export default graphql(query)(
  graphql(mutation)(SignupForm)
  );