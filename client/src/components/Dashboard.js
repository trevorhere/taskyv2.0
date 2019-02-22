import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import query from "../gql/queries/Dashboard";
import createTeam from "../gql/mutations/CreateTeam";
import createList from "../gql/mutations/CreateList";

import Loading from "./Loading";
import {
  Card,
  CardTitle,
  Button,
  Row,
  Col,
  Modal,
  Input
} from "react-materialize";
import "../styles/App.css";

const list = {
  name: "",
  description: ""
};

const team = {
  name: "",
  description: ""
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: ""
    };
  }

  renderList(items, link) {
    return items.map(({ id, name }) => {
      return (
        <li key={id} className="collection-item">
          <Link to={`/dashboard/${link}/${id}`}>{name}</Link>
        </li>
      );
    });
  }

  submitCreateList(event, id) {
    event.preventDefault();

    console.log("list", list);

    this.props
      .CreateList({
        variables: {
          name: list.name,
          description: list.description,
          ownerID: id
        },
        refetchQueries: [{ query }]
      })
      .then(() => this.props.history.push("/dashboard"));
  }

  submitCreateTeam(event, id) {
    event.preventDefault();

    this.props
      .CreateTeam({
        variables: {
          name: team.name,
          description: team.description,
          leaderID: id
        },
        refetchQueries: [{ query }]
      })
      .then(() => this.props.history.push("/dashboard"));
  }

  createTeam() {
    return (
      <Row>
        <h3 className="section-title">Create New Team</h3>
        <Input
          s={12}
          label="Name"
          onChange={event => {
            team.name = event.target.value;
          }}
          defaultValue={team.name}
        />
        <Input
          s={12}
          label="Description"
          onChange={event => {
            team.description = event.target.value;
          }}
          defaultValue={team.description}
        />
      </Row>
    );
  }

  createList() {
    return (
      <Row>
        <h3 className="section-title">Create New List</h3>
        <Input
          s={12}
          label="Name"
          onChange={event => {
            list.name = event.target.value;
          }}
          defaultValue={list.name}
        />
        <Input
          s={12}
          label="Description"
          onChange={event => {
            list.description = event.target.value;
          }}
          defaultValue={list.description}
        />
      </Row>
    );
  }

  renderModal(type) {
    return type == "list" ? this.createList() : this.createTeam();
  }

  renderListCards(items, link) {
    return items.map(({ id, name, description }) => {
      return (
        <Col key={id} m={3} s={6}>
          <Card
            onClick={() => {
              this.props.history.push(`/dashboard/${link}/${id}`);
            }}
            className="listCard"
            textClassName="white-text"
          >
            <h4 className="cardText">{name}</h4>
          </Card>
        </Col>
      );
    });
  }

  render() {
    if (this.props.data.loading) {
      return <Loading loading={this.props.data.loading} />;
    } else if (this.props.data.error) {
      return <div>Error: {this.props.data.error.message}</div>;
    }

    const { teams, lists, id } = this.props.data.user;

    console.log("user", this.props.data);
    return (
      <div className="container background">
        <h3 className="section-title">Your Lists: </h3>
        <Row>{this.renderListCards(lists, "list")}</Row>
        <hr />
        <h3 className="section-title">Your Teams: </h3>
        <Row>{this.renderListCards(teams, "team")}</Row>
        <Button
          floating
          fab="horizontal"
          icon="add"
          className="red"
          large
          style={{ bottom: "45px", right: "24px" }}
        >
          <Modal
            className="createTaskModal"
            actions={
              <div>
                <Button
                  style={{ margin: "0 !important" }}
                  className="modalButton  modal-action modal-close"
                  waves="light"
                  onClick={event => {
                    this.submitCreateList(event, id);
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
            trigger={<Button waves="light">Create List</Button>}
          >
            {this.renderModal("list")}
          </Modal>
          <Modal
            className="createTaskModal"
            actions={
              <div>
                <Button
                  style={{ margin: "0 !important" }}
                  className="modalButton  modal-action modal-close"
                  waves="light"
                  onClick={event => {
                    this.submitCreateTeam(event, id);
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
            trigger={<Button waves="light">Create Team</Button>}
          >
            {this.renderModal("team")}
          </Modal>
        </Button>
      </div>
    );
  }
}

export default compose(
  graphql(query),
  graphql(createList, { name: "CreateList" }),
  graphql(createTeam, { name: "CreateTeam" })
)(Dashboard);
