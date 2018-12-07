import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import { Link } from 'react-router-dom';
import mutation from '../gql/mutations/CreateList';
import query from '../gql/queries/Dashboard';


class CreateList extends Component {
  constructor(props){
    super(props)

    this.state = {
      name: '',
      description: ''
    }
  }

  onSubmit(event){
    event.preventDefault();

    this.props.mutate({
      variables: {
        name: this.state.name,
        description: this.state.description,
        ownerID: this.props.data.user.id },
      refetchQueries: [{ query }]
    }).then(() => this.props.history.push('/dashboard'))
  }

render(){
  return(
    <div style={{color: "#9D9C9D"}}  className="container input">
      <h3 className="section-title">Create New List</h3>
      <form onSubmit={this.onSubmit.bind(this)}>
      <label >List Name:</label>
      <input
        onChange={event => this.setState({
          name: event.target.value
        })}
        value={this.state.title}
      />
      <br/>
      <label>Description:</label>
      <input
        onChange={event => this.setState({
          description: event.target.value
        })}
        value={this.state.description}
      />
        <button className="waves-effect waves-light right btn-medium outline " style={{margin: "10px"}} type="submit" value="Submit" >Submit</button>
        <Link to="/dashboard" style={{margin: "10px"}} className="outline right" >Cancel</Link>
      </form>
    </div>
  )
}


}

export default graphql(mutation)(CreateList);