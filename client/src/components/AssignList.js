import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import query from '../gql/queries/fetchList';
import mutation from '../gql/mutations/AssignListToUser';
import { graphql } from 'react-apollo';


class AssignList extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: ''
    }
  }

  onSubmit(event){
    event.preventDefault();

    this.props.mutate({
      variables: { email: this.state.email, listID: this.props.match.params.listID},
      refetchQueries: [{ query }]
    }).then(() => this.props.history.push('/dashboard'))
  }


  render(){
    console.log('props', this.props);
    if (this.props.data.loading) { return <div>Loading...</div>; }
    return(
      <div className="container">
         <h3>Assign "{this.props.data.list.name}":</h3>
         <form onSubmit={this.onSubmit.bind(this)}>
          <label>User Email:</label>
          <input
              onChange={event => this.setState({
              email: event.target.value
             })}
            value={this.state.email}
      />
        <input className="btn-flyou are logged inating btn-large red right" style={{margin: "10px"}} type="submit" value="Submit" />
        <Link to="/dashboard" style={{margin: "10px"}} className="btn-flyou are logged inating btn-large red right" >Cancel</Link>
      </form>
      </div>
    )
  }

}

export default graphql(mutation)(
  graphql(query, {
    options: (props) => {return {variables: {listID: props.match.params.listID}}}
  })(AssignList)
);
