import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql, Query } from "react-apollo";
import query from "../gql/queries/fetchTask";
import mutation from "../gql/mutations/RemoveTask";
import Loading from "./Loading";
import { Card, CardTitle, Button, Row, Col, Table } from "react-materialize";

const style = {
  border: "2px solid grey",
  padding: "10px",
  marginTop: "20px"
};

class ViewTask extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  removeTask() {
    this.props.mutate({
      variables: { taskID: this.props.match.params.taskID }
    });

    this.props.history.push(
      `/dashboard/list/${this.props.match.params.listID}`
    );
  }

  render() {
    if (this.props.data.loading) {
      return <Loading loading={this.props.data.loading} />;
    }

    return (
      <Query
        query={query}
        variables={{ taskID: this.props.match.params.taskID }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data }) => {

          if (loading) {
            return <Loading loading={loading} />;
          } else if (error) {
            return <div>Error: {error.message}</div>;
          }

          const { task } = data;


          return (

             <div className="container">
        <h3 className="cardText">{task.content}</h3>
        <hr style={{ borderColor: "#ED6E72" }} />
        <Card className={`taskCard white-text`} title="">
          <Row>
            <Table className="white-text">
              <thead>
                <tr>
                  <th data-field="id">Status</th>
                  <th data-field="priority">Priority</th>
                  <th data-field="notes">Notes</th>
                  <th data-field="recurring">Recurring</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td>{task.notes}</td>
                  <td>{(task.recurring)? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </Table>
        <hr style={{ borderColor: "#ED6E72" }} />

 Estimated Duration: {task.durationHours}Hr{" "}
                {task.durationMinutes}Min
                <br />
                Created: {task.created}
                <br />
                Started: {task.started}
                <br />
                Finished: {task.finished}
                 {task.recurring ? (
                  <div>
                    Recurs every {task.recurringInterval}{" "}
                    {task.recurringMultiplier}
                    <br />
                    for {task.recurringDeathNumber}{" "}
                    {task.recurringDeathMultiplier}
                  </div>
                ) : (
                  <span />
                )}
          </Row>
        </Card>
        <Button
          className="backButton"
          onClick={() => {
            this.props.history.push(
             `/dashboard/list/${this.props.match.params.listID}`
            );
          }}
          large
        >
          Back
        </Button>
        <Button
          floating
          fab="horizontal"
          icon="delete"
          className="red"
          large
          style={{ bottom: "45px", right: "24px" }}
        >
           <Button
          className="red"
           onClick={() => this.removeTask()}
        >
          Remove Task
        </Button>
          
        </Button>
      </div>


           
          );
        }}
      </Query>
    );
  }
}

export default graphql(mutation)(ViewTask);
