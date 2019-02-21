import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql, Query, compose } from "react-apollo";
import query from "../gql/queries/fetchList";
import changeTaskStatus from "../gql/mutations/ChangeTaskStatus";
import setRecurringFalse from "../gql/mutations/SetRecurringFalse";
import duplicateRecurringTask from "../gql/mutations/DuplicateRecurringTask";
import createTask from "../gql/mutations/CreateTask";

import Loading from "./Loading";
import {
  Col,
  Card,
  CardTitle,
  Button,
  Row,
  Input,
  Table,
  Modal
} from "react-materialize";
import "../styles/App.css";

const moment = require("moment");
const task = {
  content: "",
  notes: "",
  durationHours: 0,
  durationMinutes: 0,
  status: "pending"
};

class ViewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      test: {},
      content: "",
      priority: "",
      status: "",
      durationHours: 0,
      durationMinutes: 0,
      notes: "",
      dueDate: "",
      timeDue: "",
      started: "",
      finished: "",
      recurring: false,
      kill: 0,
      repeat: 0,
      recurringInterval: 0,
      recurringDeathMultiplier: 0,
      recurringDeathNumber: 0,
      recurringMultiplier: ""
    };
  }

  onSubmit(event, refetch) {
    event.preventDefault();

    this.props
      .CreateTask({
        variables: {
          content: task.content,
          listID: this.props.match.params.listID,
          status: task.status,
          creatorID: this.props.data.user.id,
          priority: Number(task.priority),
          dueDate: this.state.dueDate,
          timeDue: this.state.timeDue,
          started: this.state.started,
          finished: this.state.finished,
          durationHours: Number(task.durationHours),
          durationMinutes: Number(task.durationMinutes),
          notes: task.notes,
          recurring: this.state.recurring,
          kill: this.state.kill,
          repeat: this.state.repeat,
          created: moment().format("MM/DD/YY, HH:mm"),
          recurringInterval: this.state.recurringInterval,
          recurringDeathMultiplier: this.state.recurringMultiplier,
          recurringDeathNumber: this.state.recurringDeathNumber,
          recurringMultiplier: this.state.recurringMultiplier
        }
      })
      .then(
        setTimeout(refetch(), 250)
        // this.props.history.push(
        //   `/dashboard/list/${this.props.match.params.listID}`
        // )
      );
  }

  fetchIcon(type, onClick) {
    return (
      <Button
        floating
        className="red"
        waves="light"
        icon={type}
        onClick={onClick}
        // onClick={() => {  this.changeTaskStatus(id, "complete", started, moment().format('MM/DD/YY, HH:mm'), recurring); refetch();}}
      />
    );
  }

  viewTask(id) {
    return () => {
      this.props.history.push(
        `/dashboard/list/${this.props.match.params.listID}/task/${id}`
      );
    };
  }

  setOnClick(type, id, started, finished, recurring, refetch) {
    switch (type) {
      case "done":
        return () => {
          this.changeTaskStatus(
            id,
            "complete",
            started,
            moment().format("MM/DD/YY, HH:mm"),
            recurring
          );
          refetch();
        };
      case "play_arrow":
        return () => {
          this.changeTaskStatus(
            id,
            "underway",
            moment().format("MM/DD/YY, HH:mm"),
            finished,
            recurring
          );
          refetch();
        };
      default:
        return this.viewTask(id);
    }
  }

  renderCardIcons(id, status, started, finished, recurring, refetch) {
    switch (status) {
      case "complete":
        return <div />;
      case "underway":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly"
            }}
          >
            {this.fetchIcon(
              "done",
              this.setOnClick("done", id, started, finished, recurring, refetch)
            )}
          </div>
        );
      default:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            {this.fetchIcon(
              "play_arrow",
              this.setOnClick(
                "play_arrow",
                id,
                started,
                finished,
                recurring,
                refetch
              )
            )}
            {this.fetchIcon(
              "done",
              this.setOnClick("done", id, started, finished, recurring, refetch)
            )}
          </div>
        );
    }
  }

  renderTable(tasks, refetch) {
    return tasks ? (
      tasks.map(
        (
          {
            id,
            content,
            status,
            started,
            finished,
            priority,
            durationHours,
            durationMinutes,
            recurring
          },
          i
        ) => {
          return (
            <tr key={i}>
              <td>{content}</td>
              <td>
                {/* {status} */}
                <Input
                  onChange={event => {
                    this.changeTaskStatus(
                      id,
                      event.target.value,
                      started,
                      finished,
                      recurring,
                      refetch
                    );
                  }}
                  s={8}
                  type="select"
                  defaultValue={status}
                >
                  <option value="pending">Pending</option>
                  <option value="underway">Underway</option>
                  <option value="complete">Complete</option>
                </Input>
              </td>
              <td>{priority}</td>
              <td>
                {durationHours}:{durationMinutes}
              </td>
              <td>
                <Button
                  waves="light"
                  node="a"
                  icon="chevron_right"
                  onClick={() => {
                    this.props.history.push(
                      `/dashboard/list/${
                        this.props.match.params.listID
                      }/task/${id}`
                    );
                  }}
                />
              </td>
            </tr>
          );
        }
      )
    ) : (
      <div> No tasks. </div>
    );
  }

  handleChange(name, event) {
    event.preventDefault();
    this.setState({
      name: event.target.value
    });
  }

  renderModal() {
    return (
      <div>
        <Row>
          <Input
            s={12}
            label="Task:"
            onChange={event => {
              task.content = event.target.value;
            }}
            defaultValue={task.content}
          />

          <Input
            onChange={event => {
              task.priority = event.target.value;
            }}
            s={6}
            label="Priority"
            type="select"
            defaultValue="leisure"
          >
            <option value="leisure">Not Pressing</option>
            <option value="pressing">Pressing</option>
            <option value="urgent">Urgent</option>
            <option value="nuclear">Nuclear !!!</option>
          </Input>

          <Input
            onChange={event => {
              task.status = event.target.value;
            }}
            s={6}
            label="Status"
            type="select"
            defaultValue="pending"
          >
            <option value="pending">Pending</option>
            <option value="underway">Underway</option>
            <option value="complete">Complete</option>
          </Input>
          <Input
            s={6}
            type="number"
            label="Exp. Duration Hrs:"
            defaultValue={task.durationHours}
            onChange={event => (task.durationHours = event.target.value)}
          />
          <br />
          <br />
          <Input
            s={6}
            type="number"
            label="Exp. Duration Mins:"
            onChange={event => (task.durationMinutes = event.target.value)}
            defaultValue={task.durationMinutes}
          />
          <Input
            s={12}
            label="Notes:"
            onChange={event => (task.notes = event.target.value)}
            defaultValue={task.notes}
          />
        </Row>
      </div>
    );
  }

  changeTaskStatus(taskID, status, started, finished, recurring, refetch) {
    if (recurring && status == "complete") {
      this.props.ChangeTaskStatus({
        variables: { taskID, status, started, finished }
      });
      this.props.DuplicateRecurringTask({
        variables: { taskID, status: "complete", started, finished }
      });
    } else {
      this.props.ChangeTaskStatus({
        variables: { taskID, status, started, finished }
      });
    }
    setTimeout(refetch(), 250);
    // this.props.history.push(
    //   `/dashboard/list/${this.props.match.params.listID}`
    // )
  }

  filteredTasks(list, filter) {
    return list.tasks
      ? list.tasks.filter(({ status }) => {
          return status == filter;
        })
      : null;
  }

  sortPriority(tasks) {
    return tasks.sort(function(a, b) {
      return b.priority - a.priority;
    });
  }

  sortDuration(tasks) {
    return tasks.sort(function(a, b) {
      let bDurration = b.durationHours * 60 + b.durationMinutes;
      let aDurration = a.durationHours * 60 + a.durationMinutes;

      if (aDurration > bDurration) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  minutesSince(date) {
    if (date == "N/A") {
      return 9999999;
    }
    let now = moment().format("MM/DD/YY, HH:mm");
    let diff = Math.abs(new Date(now) - new Date(date));
    let minutes = Math.floor(diff / 1000 / 60);
    return minutes;
  }

  setRecurringFalse(taskID) {
    this.props.SetRecurringFalse({
      variables: { taskID }
    });
  }

  resetRecurringTasks(list) {
    if (list.tasks) {
      list.tasks.map(task => {
        if (task.recurring) {
          if (task.kill < this.minutesSince(task.created)) {
            this.setRecurringFalse(task.id);
          } else if (
            task.repeat < this.minutesSince(task.finished) &&
            task.status == "complete"
          ) {
            this.changeTaskStatus(task.id, "pending", "N/A", "N/A");
          }
        }
      });
    }
  }

  setGlow = status => {
    if (status == "underway") {
      return "glowGreen";
    } else if (status == "pending") {
      return "glowBlue";
    }
  };

  renderTasks(tasks, taskStatus, refetch) {
    if (taskStatus == "pending") {
      console.log(this.sortDuration(tasks));
      console.log(this.sortPriority(tasks));
    }

    if (tasks.length) {
      return (
        <div>
          <Card className={`taskCard ${this.setGlow(taskStatus)}`} title="">
            <h4 className="section-title">{taskStatus}</h4>
            <Row>
              <Col s={12} m={12} l={12}>
                <Table>
                  <thead>
                    <tr>
                      <th data-field="task">Task</th>
                      <th data-field="id">Status</th>
                      <th data-field="name">Priority</th>
                      <th data-field="price">Duration</th>
                      <th data-field="price">View</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderTable(tasks, refetch)}</tbody>
                </Table>
              </Col>
            </Row>
          </Card>
        </div>
      );
    } else {
      return <div />;
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Loading loading={this.props.data.loading} />;
    }

    return (
      <Query
        query={query}
        variables={{ listID: this.props.match.params.listID }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data, refetch }) => {
          const { list } = data;

          if (loading) {
            return <Loading loading={loading} />;
          } else if (error) {
            return <div>Error: {error.message}</div>;
          }

          this.resetRecurringTasks(list);
          const pendingTasks = this.filteredTasks(list, "pending");
          const underwayTasks = this.filteredTasks(list, "underway");
          const completeTasks = this.filteredTasks(list, "complete");

          return (
            <div className="container">
              <h3 className="cardText">{list.name}</h3>
              <hr style={{ borderColor: "#ED6E72" }} />
              {this.renderTasks(underwayTasks, "underway", refetch)}
              {this.renderTasks(pendingTasks, "pending", refetch)}
              {this.renderTasks(completeTasks, "complete", refetch)}

              <Button
                floating
                fab="horizontal"
                icon="add"
                className="red"
                large
                style={{ bottom: "45px", right: "24px" }}
              >
                <Button
                  onClick={() => {
                    this.props.history.push(
                      `${this.props.match.url}/assignlist`
                    );
                  }}
                  className=""
                >
                  Assign List
                </Button>

                <Modal
                  className="createTaskModal"
                  actions={
                    <div>
                      <Button
                        style={{ margin: "0 !important" }}
                        className="modalButton  modal-action modal-close"
                        waves="light"
                        onClick={event => {
                          this.onSubmit(event, refetch);
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        style={{ margin: "0 !important" }}
                        className="modalButton red modal-action modal-close"
                        waves="light"
                      >
                        Cancel
                      </Button>
                    </div>
                  }
                  trigger={<Button waves="light">Create Task</Button>}
                >
                  {this.renderModal()}
                </Modal>
              </Button>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default compose(
  graphql(changeTaskStatus, { name: "ChangeTaskStatus" }),
  graphql(createTask, { name: "CreateTask" }),
  graphql(setRecurringFalse, { name: "SetRecurringFalse" }),
  graphql(duplicateRecurringTask, { name: "DuplicateRecurringTask" })
)(ViewList);
