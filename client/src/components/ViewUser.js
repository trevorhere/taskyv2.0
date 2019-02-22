import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import query from "../gql/queries/fetchUser";
import Loading from "./Loading";
import { Card, Button, Row, Modal, Input, Col, Table } from "react-materialize";

const style = {
  border: "2px solid grey",
  padding: "10px",
  marginTop: "20px"
};

class ViewUser extends Component {
  constructor(props) {
    super(props);
  }

renderTasks(tasks){
  return <div> </div>
}

  renderLists(lists) {
    return lists.map(({ id, name, tasks }) => {
        return (  
             <Col className="taskCol" key={id} s={6} m={3} >
          <Card className={`taskCard white-text`}  s={6} m={3} l={3} title="">
             
                <h4 className="section-title">{name}</h4>
                  <Table className="white-text">
              <thead>
                <tr>
                  <th data-field="id">Task</th>
                  <th data-field="name">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(({content, status}) => {
                  return (
                <tr>
                  <td>{content}</td>
                  <td>{status}</td>
                </tr>
                  )
                })} 
              </tbody>
            </Table>
             </Card>

             </Col>
        )
    });
  }

  render() {
    const { userID, loading, error } = this.props.data;
    if (loading) {
      return <Loading loading={loading} />;
    }else if (error) {
      return <div>Error: {error.message}</div>;
    }
    console.log(this.props);

    return (
      <div className="container">
        <h3 className="cardText">{userID.name}</h3>
        <hr style={{ borderColor: "#ED6E72" }} />
        <Card className={`taskCard white-text`} title="">
          <Row>
            <Table className="white-text">
              <thead>
                <tr>
                  <th data-field="id">Email</th>
                  <th data-field="name">Position</th>
                  <th data-field="price">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userID.email}</td>
                  <td>{userID.position}</td>
                  <td>{userID.phoneNumber}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Card>
        {userID.lists.length ? (
          <div>
           <h3 className="cardText">Lists</h3>
        <hr style={{ borderColor: "#ED6E72" }} />
        <Row>
          {this.renderLists(userID.lists)}
        </Row>
          </div>
        ) : (
          <div> </div>
        )}

        <div style={{ marginTop: "10px" }} />
        <Button
          className="backButton"
          onClick={() => {
            this.props.history.push(
              `/dashboard/team/${this.props.match.params.teamID}`
            );
          }}
          large
        >
          Back
        </Button>
      </div>
    );
  }
}

export default graphql(query, {
  options: props => {
    return { variables: { userID: props.match.params.userID } };
  }
})(ViewUser);
