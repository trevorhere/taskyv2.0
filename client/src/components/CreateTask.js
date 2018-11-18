import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import { Link } from 'react-router-dom';
import createTask from '../gql/mutations/CreateTask';
import ReactRadioButtonGroup from 'react-radio-button-group';


const moment = require('moment');
let mutation = createTask;

class CreateTask extends Component {
  constructor(props){
    super(props)

    this.state = {
      content: '',
      status: "pending",
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
      priority: 0,
      duration: 'test',
      durationHours: 0,
      durationMinutes: 0,
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
        priority: this.state.priority,
        dueDate: this.state.dueDate,
        timeDue: this.state.timeDue,
        started: this.state.started,
        finished: this.state.finished,
        durationHours: this.state.durationHours,
        durationMinutes: this.state.durationMinutes,
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

render(){
  return(
    <div className="container">
      <h3>Create New Task</h3>
      <form onSubmit={this.onSubmit.bind(this)}>
      <label>Task Name:</label>
      <input
        onChange={event => this.setState({
          content: event.target.value
        })}
        value={this.state.content}
      />
      <label>Status: </label>
      <  ReactRadioButtonGroup
          name="status"
          options={["pending", "underway","complete"]}
          value={this.state.status}
          onChange={checkedValue => {
            this.setState({
              status: checkedValue
            })
          }}
      />
      <br/>

      <label>Priority:</label>
      <br/>
      <label>Enter a number between 0-4: </label>
      <label>0: Not pressing.             </label>
      <label>1: At soonest convenience. </label>
      <label>2: Important. </label>
      <label>3: Urgent. </label>
      <label>4: Nuclear !!!. </label>

      <  ReactRadioButtonGroup
          name="priority"
          options={["0", "1","2","3","4"]}
          value={this.state.priority.toString()}
          onChange={checkedValue => {
            this.setState({
              priority: Number(checkedValue)
            })
          }}
      />
      <br/>
      <label>Duration - Hours:</label>
      <input
        type="Number"

        onChange={event => this.setState({
          durationHours: Number(event.target.value)
        })}
        value={this.state.durationHours}
      />
      <label>Duration - Minutes:</label>
      <input
        type="Number"
        onChange={event => this.setState({
          durationMinutes: Number(event.target.value)
        })}
        value={this.state.durationMinutes}
      />
      <br/>
      <label>Recurring?:</label>
      <ReactRadioButtonGroup
          name="recurringText"
          options={["Yes", "No"]}
          value={this.state.recurringText}
          onChange={checkedValue => {
            this.setState({
              recurringText: checkedValue
            })
          }}
      />
      <hr/>
      <div style={{color: "black",backgroundColor: "rgba(206, 66, 87, .3)", padding: "20px"}}>

      <label style={{color: "black"}}>If this task is recurring, consider the following items:</label>
      <br/>
      <label  style={{color: "black"}} >This task should repeat every: </label>
      <input
        type="Number"
        onChange={event => {this.setState({
          recurringInterval: Number(event.target.value),
        })
        this.handleRecurringBirth();
        this.handleRecurringDeath();
      }}
        value={this.state.recurringInterval}
      />
      <ReactRadioButtonGroup
          name="recurringMultiplier"
          options={["Minute(s)", "Hour(s)", "Day(s)", "Month(s)"]}
          value={this.state.recurringMultiplier}
          onChange={checkedValue => {
            this.setState({
              recurringMultiplier: checkedValue,
            })
            this.handleRecurringBirth();
            this.handleRecurringDeath();
          }}
      />
      <br/>
      <label  style={{color: "black"}}>This task should stop repeating in: </label>



      <input
        type="Number"
        onChange={event => {
          this.setState({
            recurringDeathNumber: Number(event.target.value)
          })
          this.handleRecurringBirth();
          this.handleRecurringDeath();
        }}
        value={this.state.recurringDeathNumber}
      />
      <ReactRadioButtonGroup
          name="recurringDeathMultiplier"
          options={["Minute(s)", "Hour(s)", "Day(s)", "Month(s)"]}
          value={this.state.recurringDeathMultiplier}
          onChange={checkedValue => {
          this.setState({
             recurringDeathMultiplier: checkedValue
          })
          this.handleRecurringBirth();
          this.handleRecurringDeath();
        }}
      />
          <label style={{color: "black", textDecoration: "bold"}}>Are you sure you want to make this task recurring?</label>
          <ReactRadioButtonGroup
          name="test"
          options={["Yes", "No"]}
          value={this.state.recurringDoubleCheck}

          onChange={checkedValue => {
            this.handleRecurringBirth();
            this.handleRecurringDeath();
            if(this.state.recurringText == "Yes" && checkedValue == "Yes"){
              this.setState({
                recurring: true,
                recurringDoubleCheck: checkedValue

              });

            } else {
              this.setState({
                recurring: false,
                recurringDoubleCheck: checkedValue
              })
            }

          }}
      />
      </div>
      <hr/>
      <label>Notes:</label>
      <input
        onChange={event => this.setState({
          notes: event.target.value
        })}
        value={this.state.notes}
      />
          <input className="btn-flyou are logged inating btn-large red right" style={{margin: "10px"}} type="submit" value="Submit" />
          <Link style={{margin: "10px"}} className="btn-flyou are logged inating btn-large red right" to={`/dashboard/list/${this.props.match.params.listID}`}>Cancel</Link>
      </form>
    </div>
  )
}
}

export default graphql(mutation)(CreateTask);