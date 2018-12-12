import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, Query, compose } from 'react-apollo';
import query from '../gql/queries/fetchList';
import changeTaskStatus from '../gql/mutations/ChangeTaskStatus';
import setRecurringFalse from '../gql/mutations/SetRecurringFalse';
import duplicateRecurringTask from '../gql/mutations/DuplicateRecurringTask';
import Loading from './Loading'
import  {Col, Card, CardTitle, Button } from 'react-materialize'
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

          // <p><a className="viewLink " href={}>View</a></p>

  fetchIcon(type, onClick){
    return (
    <Button
    floating
    className='red'
    waves='light'
    icon={type}
    onClick={onClick}
    // onClick={() => {  this.changeTaskStatus(id, "complete", started, moment().format('MM/DD/YY, HH:mm'), recurring); refetch();}}
    />
    )
  }

  viewTask(id){
    return (() => {
      this.props.history.push(`/dashboard/list/${this.props.match.params.listID}/task/${id}`)
     }
    )
  }

  setOnClick(type, id, started, finished, recurring, refetch){
    switch(type){
      case "done":
        return(() => {
          this.changeTaskStatus(
              id,
              "complete",
              started,
              moment().format('MM/DD/YY, HH:mm'),
              recurring
            );
            refetch();
        })
      case "play_arrow":
        return(() => {
          this.changeTaskStatus(
              id,
              "underway",
              moment().format('MM/DD/YY, HH:mm'),
              finished,
              recurring
            );
            refetch();
        });
      default:
        return this.viewTask(id);
    }
  }

  renderCardIcons(id, status, started, finished ,recurring, refetch){
    switch(status){
      case "complete":
      return (
        <div style={{display:'flex', flexDirection:"row", justifyContent:"space-between" }}>
           {this.fetchIcon("help", this.viewTask(id))}
        </div>
      )
      case "underway":
      return (
        <div style={{display:'flex', flexDirection:"row", justifyContent:"space-evenly" }}>
           {this.fetchIcon("help", this.viewTask(id))}
           {this.fetchIcon("done", this.setOnClick("done",id, started, finished ,recurring, refetch))}
        </div>
    )
      default:
      return (
        <div style={{display:'flex', flexDirection:"row", justifyContent:"space-between" }}>
           {this.fetchIcon("help", this.viewTask(id))}
           {this.fetchIcon("play_arrow", this.setOnClick("play_arrow",id, started, finished ,recurring, refetch))}
           {this.fetchIcon("done", this.setOnClick("done",id, started, finished ,recurring, refetch))}
        </div>
    )

    }


  }

  renderTasks(tasks, refetch){
    return ( tasks ?
      tasks.map(({id, content, status, started, finished, priority, durationHours, durationMinutes, recurring }) => {
      return (
        <Col s={12} m={4}>
        <Card style={{backgroundColor: '#2A3335'}} className={this.setGlow(status)} header={<CardTitle waves='light'/>}
          title={<span style={{color:"#070808"}}>{content}</span>}>
          <div style={style} className="">
            <span><span style={{ fontSize: "16px", fontWeight:"bold"}}>Priority</span>: Level {priority}</span>
            <span><span style={{ fontSize: "16px", fontWeight:"bold"}}>Duration: </span> {durationHours}Hr {durationMinutes}Min</span>
            <span><span style={{ fontSize: "16px", fontWeight:"bold"}}>Status:</span> {status}</span>
            <br/>
        </div>
          {this.renderCardIcons(id, status, started,finished, recurring, refetch)}
        </Card>
      </Col>
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
          console.log('list',list)

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
                className="outline right"
                style={{margin: "10px"}}

              >
                Create Task
              </Link>
                <Link
                to={`${this.props.match.url}/assignlist`}
                className="outline right"
                style={{margin: "10px"}}
                >
                Assign List
              </Link>
              <Link
                to={`/dashboard`}
                style={{margin: "10px"}}
                className="outline right">Back</Link>
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
