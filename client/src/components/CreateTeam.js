import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import mutation from '../gql/mutations/CreateTeam';
import query from '../gql/queries/Dashboard';
import { Link } from 'react-router-dom';



class CreateTeam extends Component {
  constructor(props){
    super(props)

    this.state = {
      name: ''
    }
  }

  onSubmit(event){
    event.preventDefault();

    this.props.mutate({
      variables: { name: this.state.name, leaderID: this.props.data.user.id },
      refetchQueries: [{ query }]
    }).then(() => this.props.history.push('/dashboard'))
  }

render(){
  return(
    <div className="container">
      <h3>Create New Team</h3>
      <form onSubmit={this.onSubmit.bind(this)}>
      <label>Team Name:</label>
      <input
        onChange={event => this.setState({
          name: event.target.value
        })}
        value={this.state.title}
      />
        <input className="btn-large red right" style={{margin: "10px"}} type="submit" value="Submit" />
        <Link to="/dashboard" style={{margin: "10px"}} className="btn-flyou are logged inating btn-large red right" >Cancel</Link>

      </form>
    </div>
  )
}
}

export default graphql(mutation)(CreateTeam);