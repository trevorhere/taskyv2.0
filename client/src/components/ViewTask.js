import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, Query } from 'react-apollo';
import query from '../gql/queries/fetchTask';
import mutation from '../gql/mutations/RemoveTask';
import Loading from './Loading';

const style = {

     border:'2px solid grey',
     padding: '10px',
     marginTop: '20px'

}


class ViewTask extends Component{
constructor(props){
  super(props)

  this.state = {

  }
}
      removeTask(){
        this.props.mutate({
          variables: {taskID: this.props.match.params.taskID}
        });

        this.props.history.push(`/dashboard/list/${this.props.match.params.listID}`)

      }


  render(){
    if(this.props.data.loading){
      return (<Loading loading={this.props.data.loading}/>);
    }

    return (
      <Query
        query={query}
        variables={{ taskID: this.props.match.params.taskID}}
        fetchPolicy="cache-and-network"
      >
        {({loading, error, data }) => {
          const { task } = data;


          if (loading) {
            return (<Loading loading={loading}/>);
          } else if (error) {
            return <div>Error: {error.message}</div>;
          }
          return (
            <div className="container">
            <div style={style} className="">
            <h3>Task: {task.content}</h3>
            Status: {task.status}
            <br/>
            Priority: {task.priority}
            <br/>
            Estimated Duration:  {task.durationHours}Hr {task.durationMinutes}Min
            <br/>
            Created: {task.created}
            <br/>
            Started: {task.started}
            <br/>
            Finished: {task.finished}
            <br/>
            {task.recurring ? <div>
              Recurs every {task.recurringInterval} {task.recurringMultiplier}
              <br/>
              for {task.recurringDeathNumber} {task.recurringDeathMultiplier}
            </div> : <span></span>}
            <br/>
            Notes: {task.notes}
            <br/>
            Feedback: {task.feedback}
            <br/>
            </div>
            <div style={{marginTop: "10px"}}>

              <a
                to={`/dashboard/list/${this.props.match.params.listID}`}
                style={{margin: "10px"}}
                className="outline right"
                 onClick={() => this.removeTask()}
                >
                Remove Task
                </a>
                <Link
                to={`/dashboard/list/${this.props.match.params.listID}`}
                style={{margin: "10px"}}
                className="outline right"
                >Back</Link>
                </div>


          </div>
          );
        }}
      </Query>
    )
  }
}


export default graphql(mutation)(ViewTask);
