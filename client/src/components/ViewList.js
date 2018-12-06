import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, Query, compose } from 'react-apollo';
import query from '../gql/queries/fetchList';
import changeTaskStatus from '../gql/mutations/ChangeTaskStatus';
import setRecurringFalse from '../gql/mutations/SetRecurringFalse';
import duplicateRecurringTask from '../gql/mutations/DuplicateRecurringTask';
import Loading from './Loading'
import '../styles/App.css';


const moment = require('moment');


const style = {
  display: 'flex',
  flexDirection: "column",
  alignItems: 'left',
  paddingTop:"0"
}




const cardStyle = {
  backgroundColor: "#2A3335",
  margin: "10px",
  padding: "20px"
  // borderColor: "#60B87C",
  // boxShadow: "0 0 20px #60B87C",
  // animation: "glowing 1500ms infinite"
}





class ViewList extends Component{
  constructor(props){
    super(props)

    this.state = {
      test: {}
    }
  }

  setGlow = (status) => {
    if(status == "underway"){
      return "glowGreen";
    } else if( status == "pending"){
      return "glowYellow";
    } else {
       return ""
     }
  }

  renderTasks(tasks, refetch){
    return ( tasks ?
      tasks.map(({id, content, status, started, finished, priority, durationHours, durationMinutes, recurring }) => {
      return (
        <div className="col s12 m4">
      <div class="card"  style={cardStyle} className={this.setGlow(status)}>
      <span className="card-title" style={{fontSize:"24px"}}>
        {<div style={{marginRight: "20px" }}>
         <Link to={`/dashboard/list/${this.props.match.params.listID}/task/${id}`} >{content}</Link>
          <div style={{float:"right"}}>{
          status == "complete" ? <div></div> :
          <div>
            {status == "underway" ?
            <div>
              <i
                className="material-icons"
                onClick={() => {this.changeTaskStatus(id, "complete", started, moment().format('MM/DD/YY, HH:mm'), recurring); refetch();}}
                style={{paddingLeft:"10px"}}
              > done</i>
            </div> :
            <div>
              <i
                className="material-icons"
                onClick={() => {this.changeTaskStatus(id, "underway", moment().format('MM/DD/YY, HH:mm'), finished, recurring); refetch();}}
                style={{paddingLeft:"10px"}}
               >add</i>
              <i
                className="material-icons"
                onClick={() => {this.changeTaskStatus(id, "complete", started, moment().format('MM/DD/YY, HH:mm'), recurring); refetch();}}
                style={{paddingLeft:"10px"}}
              > done</i>
            </div>
            }
          </div> }
          </div>
          </div> }
      </span>
      <br></br>
      <div className="card-content">
        <div style={style} className="">
              <span style={{ fontSize: "16px", fontWeight:"bold"}}>
              Priority:
              </span> Level {priority}
              <br/>
              <span style={{ fontSize: "16px", fontWeight:"bold"}}>
                Duration:
              </span>
              {durationHours}Hr {durationMinutes}Min
              <br/>
              <span style={{ fontSize: "16px", fontWeight:"bold"}}>
                Status:
              </span>
            { status}
        </div>
        <br/>
        <div className="card-action">
            <a href={``}>View</a>
          </div>
      </div>
      </div>
      </div>

      )}) : <div> No tasks. </div> )}


    changeTaskStatus(taskID, status, started, finished, recurring){

      if(recurring && status == "complete"){
        this.props.ChangeTaskStatus({
          variables: { taskID, status, started , finished }
        })
        this.props.DuplicateRecurringTask({
          variables: { taskID, status: "complete", started , finished }
        })
      } else {
        this.props.ChangeTaskStatus({
          variables: { taskID, status, started , finished }
        })
      }
    }


    filteredTasks(list, filter){
        return (list.tasks ? list.tasks.filter(({status }) => {
          return status == filter
        }) : null )
      }

    sortPriority(tasks){
        return tasks.sort(function(a,b){
          return b.priority - a.priority;
        })
      }


    sortDuration(tasks){
      return tasks.sort(function(a,b){
        let bDurration = ((b.durationHours * 60) + b.durationMinutes);
        let aDurration = ((a.durationHours * 60) + a.durationMinutes);

        if(aDurration > bDurration){
          return 1
        } else {
          return -1
        }
      })
    }

    minutesSince(date){
      if(date == "N/A"){
        return 9999999;
      }
      let now = moment().format('MM/DD/YY, HH:mm');
      let diff = Math.abs(new Date(now) - new Date(date));
      let minutes = Math.floor((diff/1000)/60);
      return minutes
    }

    setRecurringFalse(taskID){
        this.props.SetRecurringFalse({
          variables: { taskID }
        })
    }

    resetRecurringTasks(list){
      if(list.tasks){
        list.tasks.map(task => {
          if(task.recurring ){

            if(task.kill < this.minutesSince(task.created)){
                this.setRecurringFalse(task.id);
            } else if(
                task.repeat < this.minutesSince(task.finished) &&
                task.status == "complete" ){
             this.changeTaskStatus(task.id, "pending", "N/A","N/A")
            }
          }
         })
      }
    }

  render(){
    if(this.props.data.loading){
      return (<Loading loading={this.props.data.loading}/>);
    }

    return (

      <Query
        query={query}
        variables={{ listID: this.props.match.params.listID}}
        fetchPolicy="cache-and-network"
      >
        {({loading, error, data, refetch }) => {
          const { list } = data;

          if (loading) {
            return (
              <Loading loading={loading} />
              );
          } else if (error) {
            return <div>Error: {error.message}</div>;
          }

         this.resetRecurringTasks(list)
         const pendingTasks  =  this.filteredTasks(list, "pending");
         const underwayTasks =  this.filteredTasks(list, "underway");
         const completeTasks =  this.filteredTasks(list, "complete");

         const renderPending = pendingTasks.length ? (
          <div>
            {console.log(this.sortDuration(pendingTasks))}
            {console.log(this.sortPriority(pendingTasks))}
             <h4 className="section-title">Pending:</h4>
             <div className="row">
                 {this.renderTasks(pendingTasks, refetch)}
             </div>
             <hr style={{borderColor:"#ED6E72"}}/>
             </div> ) : <div></div>

         const renderUnderway = underwayTasks.length ? (
           <div>
              <h4 className="section-title">Underway:</h4>
              <div className="row">
                  {this.renderTasks(underwayTasks, refetch)}
              </div>
              <hr style={{borderColor:"#ED6E72"}}/>
              </div> ) : <div></div>

        const renderComplete = completeTasks.length ? (
          <div>
             <h4 className="section-title">Complete:</h4>
              <div className="row">
                 {this.renderTasks(completeTasks, refetch)}
               </div>
             <hr style={{borderColor:"#ED6E72"}}/>
             </div> ) : <div></div>


          return (
            <div className="container">
            <h3 className="section-title">{list.name}</h3>
            <hr style={{borderColor:"#ED6E72"}}/>
            {renderUnderway}
            {renderPending}
            {renderComplete}

              <div style={{marginTop: "10px"}}>
              <Link
                to={`${this.props.match.url}/createtask`}
                className="btn-large red right"
                style={{margin: "10px"}}

              >
                Create Task
              </Link>
                <Link
                to={`${this.props.match.url}/assignlist`}
                className="btn-large red right"
                style={{margin: "10px"}}
                >
                Assign List
              </Link>
              <Link
                to={`/dashboard`}
                style={{margin: "10px"}}
                className=" btn-large red right">Back</Link>
                </div>
          </div>
          );
        }}
      </Query>
    )
  }
}

export default compose(
  graphql(changeTaskStatus, {name: "ChangeTaskStatus"}),
  graphql(setRecurringFalse, {name: "SetRecurringFalse"}),
  graphql(duplicateRecurringTask, {name: "DuplicateRecurringTask"})
  )(ViewList)
