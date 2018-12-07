import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {graphql} from 'react-apollo';
import { Link } from 'react-router-dom';
import createTask from '../gql/mutations/CreateTask';
import  {Row, Input } from 'react-materialize'

const moment = require('moment');
let mutation = createTask;

class CreateTask extends Component {
  constructor(props){
    super(props)

    this.state = {
      content: '',
      status: "n/a",
      notes: '',
      value: 'select',
      dueDate: 'N/A',
      timeDue: 'N/A',
      started: 'N/A',
      finished: 'N/A',
      recurringText: "No",
      recurringDoubleCheck: "No",
      recurring: false,
      recurringInterval: 0,
      recurringMultiplier: "Minute(s)",
      recurringDeathNumber: 0,
      recurringDeathMultiplier: "Minute(s)",
      priority: '0',
      duration: 'test',
      durationHours: '',
      durationMinutes: '',
      kill: 0,
      repeat:0,
      position: 2,
    }
  }



  onSubmit(event){
    event.preventDefault();

    this.props.mutate({
      variables: {
        content: this.state.content,
        listID: this.props.match.params.listID,
        status: this.state.status,
        creatorID: this.props.data.user.id,
        priority: Number(this.state.priority),
        dueDate: this.state.dueDate,
        timeDue: this.state.timeDue,
        started: this.state.started,
        finished: this.state.finished,
        durationHours: Number(this.state.durationHours),
        durationMinutes: Number(this.state.durationMinutes),
        notes: this.state.notes,
        recurring: this.state.recurring,
        kill:this.state.kill,
        repeat: this.state.repeat,
        created:moment().format('MM/DD/YY, HH:mm'),
        recurringInterval: this.state.recurringInterval,
        recurringDeathMultiplier: this.state.recurringMultiplier,
        recurringDeathNumber: this.state.recurringDeathNumber,
        recurringMultiplier: this.state.recurringMultiplier
      },
    }).then(() => this.props.history.push(`/dashboard/list/${this.props.match.params.listID}`))
  }




  handleRecurringBirth(){
      let num  = this.state.recurringInterval;
      let multiplier = this.state.recurringMultiplier;
    switch(multiplier){
      case "Minute(s)":
        this.setState({
          repeat: num
        })
        break;
      case "Hour(s)":
        this.setState({
          repeat: num * 60
        })
        break;
      case "Day(s)":
        this.setState({
          repeat: num * 1488
        })
        break;
      case "Month(s)":
        this.setState({
          repeat: num * 17856
        })
        break;
      default:
        alert('error entering recurring task repeat information');
     }
  }

  handleRecurringDeath(){
      let num  = this.state.recurringDeathNumber;
      let multiplier = this.state.recurringDeathMultiplier;
    switch(multiplier){
      case "Minute(s)":
        this.setState({
          kill: num
        })
        break;
      case "Hour(s)":
        this.setState({
          kill: num * 60
        })
        break;
      case "Day(s)":
        this.setState({
        kill: num * 1488
        })
        break;
      case "Month(s)":
        this.setState({
        kill: num * 17856
        })
        break;;
      default:
        alert('Error entering recurring task end information');
    }

}

  handleSelector(status) {
    if(status == "complete"){
      this.setState({
        status,
        started: moment().format('MMMM Do YYYY, h:mm:ss a'),
        finished: moment().format('MMMM Do YYYY, h:mm:ss a')
      })
    } else if(status == "underway"){
      this.setState({
        status,
        started: moment().format('MMMM Do YYYY, h:mm:ss a'),
        finished: 'N/A'
      })
    } else if(status == "pending"){
      this.setState({
        status,
        finished: 'N/A',
        started: 'N/A'
      });
    } else {
      this.setState({
        status: "pending",
        finished:  'N/A',
        started: 'N/A'
      });
    }
  }

  selectorOptions = ["one", "two", "three"].map( (option, index) => {
    return (
       <option key={index} value={Object.keys(option)[0]}>
          {Object.values(option)[0]}
       </option>
     )
   })

render(){
  return(
    <div style={{color: "#9D9C9D"}} className="container">

      <h3 className="section-title">Create Task</h3>
      <form onSubmit={this.onSubmit.bind(this)}>

      <Row>
      <Input  s={12} label="Task:"
         onChange={event => this.setState({
          content: event.target.value
        })}
        value={this.state.content}
      />

      <Input s={6} type='select' className="browser-default" style={{backgroundColor:"#192123", paddingTop: "10px"}} value={this.state.priority} onChange={value => { console.log(value.target.value); this.setState({
      priority: value.target.value
      })}}>
      <option value="0" disabled="disabled" selected="selected">Priority: </option>
      <option value='1'>Not Pressing</option>
      <option value='2'>Pressing</option>
      <option value='3'>Urgent</option>
      <option value='4'>Nuclear !!!</option>
      </Input>
      <Input
          s={6}
          type='select'
          className="browser-default"
          style={{backgroundColor:"#192123", paddingTop: "10px"}}
          value={this.state.status}
          onChange={ event => {
            console.log('status', event.target.value);
            this.setState({ status: event.target.value })
          }}
          defaultValue="n/a"
      >
      <option value="n/a" disabled="disabled" >Status: </option>
      <option value='pending'>Pending</option>
      <option value='underway'>Underway</option>
      <option value='complete'>Complete</option>
      </Input>
      <Input  s={6} type="number" label="Exp. Duration Hrs:"
       value={this.state.durationHours}
          onChange={event => this.setState({
          durationHours: event.target.value
        })}/>
        <br/>
        <br/>
      <Input  s={6} type="number" label="Exp. Duration Mins:"
                  onChange={event => this.setState({
                    durationMinutes: event.target.value
                  })}
                  value={this.state.durationMinutes}
      />
      <Input  s={12} label="Notes:"
         onChange={event => this.setState({
          notes: event.target.value
        })}
        value={this.state.notes}
      />
    </Row>
          <button className="waves-effect waves-light right btn-medium outline " style={{margin: "10px"}} type="submit" value="Submit" >Submit</button>
          <Link style={{margin: "10px"}} className="outline right" to={`/dashboard/list/${this.props.match.params.listID}`}>Cancel</Link>
      </form>
    </div>
  )
}
}

export default graphql(mutation)(CreateTask);