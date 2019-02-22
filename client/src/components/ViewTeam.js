import React, { Component } from "react";
import { Query, graphql, compose } from "react-apollo";
import query from "../gql/queries/fetchTeam";
import createUser from "../gql/mutations/CreateUser";
import existingUserToTeam from "../gql/mutations/ExistingUserToTeam";
import Loading from "./Loading";
import { Card, Button, Row, Modal, Input, Col, Table } from "react-materialize";

const user = {
  email: "",
  password: "",
  name: "",
  position: "",
  phoneNumber: ""
};

class ViewTeam extends Component {
  constructor(props) {
    super(props);
  }

  renderTable(team, groupType) {
    console.log(team);
    return groupType === "member" ? (
      team.map(({ id, name, position, phoneNumber }, i) => {
        return (
          <tr key={i}>
            <td>{name}</td>
            <td>{position}</td>
            <td>{phoneNumber}</td>
            <td>
              <Button
                waves="light"
                node="a"
                icon="chevron_right"
                onClick={() => {
                  this.props.history.push(
                    `/dashboard/team/${
                      this.props.match.params.teamID
                    }/user/${id}`
                  );
                }}
              />
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td>{team.name}</td>
        <td>{team.position}</td>
        <td>{team.phoneNumber}</td>
        <td>
          <Button
            waves="light"
            node="a"
            icon="chevron_right"
            onClick={() => {
              this.props.history.push(
                `/dashboard/team/${this.props.match.params.teamID}/user/${
                  team.id
                }`
              );
            }}
          />
        </td>
      </tr>
    );
  }

  renderTeam(members, groupType) {
    return (
      <div>
        <Card className={`taskCard`} title="">
          <h4 className="section-title">{groupType}</h4>
          <Row>
            <Col s={12} m={12} l={12}>
              <Table className="white-text">
                <thead>
                  <tr>
                    <th data-field="Name">Name</th>
                    <th data-field="position">Position</th>
                    <th data-field="number">Number</th>
                    <th data-field="price">View</th>
                  </tr>
                </thead>
                <tbody>{this.renderTable(members, groupType)}</tbody>
              </Table>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  viewProfile(team, id) {
    return () => {
      console.log("test");
      this.props.history.push(`/dashboard/team/${team.id}/user/${id}`);
    };
  }

  createUserForm() {
    return (
      <Row>
        <h3 className="section-title">Create User</h3>
        <Input
          s={12}
          label="Email"
          onChange={event => {
            user.email = event.target.value;
          }}
          defaultValue={user.email}
        />
        <Input
          s={12}
          label="Name"
          onChange={event => {
            user.name = event.target.value;
          }}
          defaultValue={user.name}
        />
        <Input
          s={12}
          label="Position"
          onChange={event => {
            user.position = event.target.value;
          }}
          defaultValue={user.position}
        />
        <Input
          s={12}
          label="Phone Number - country code included, i.e: '+1'"
          onChange={event => {
            user.phoneNumber = event.target.value;
          }}
          defaultValue={user.phoneNumber}
        />
        <Input
          s={12}
          label="Password"
          type="password"
          onChange={event => {
            user.password = event.target.value;
          }}
          defaultValue={user.password}
        />
      </Row>
    );
  }
  findUserForm() {
    return (
      <div>
        <h3 className="section-title">Add Existing User</h3>
        <Input
          s={12}
          label="Email"
          onChange={event => {
            user.email = event.target.value;
          }}
          defaultValue={user.email}
        />
      </div>
    );
  }

  renderModal(type) {
    return type == "create" ? this.createUserForm() : this.findUserForm();
  }
  createUserMutation(event) {
    event.preventDefault();
    const { email, password, name, position, phoneNumber } = user;
    this.props
      .CreateUser({
        variables: {
          email,
          password,
          name,
          position,
          phoneNumber,
          teamID: this.props.match.params.teamID
        },
        refetchQueries: [{ query }]
      })
      .then(
        this.props.history.push(
          `/dashboard/team/${this.props.match.params.teamID}`
        )
      );
  }

  findUserMutation(event) {
    event.preventDefault();
    this.props
      .ExistingUserToTeam({
        variables: {
          email: user.email,
          teamID: this.props.match.params.teamID
        },
        refetchQueries: [{ query }]
      })
      .then(
        this.props.history.push(
          `/dashboard/team/${this.props.match.params.teamID}`
        )
      );
  }

  render() {
    if (this.props.data.loading) {
      return <Loading loading={this.props.data.loading} />;
    }
    return (
      <Query
        query={query}
        variables={{ teamID: this.props.match.params.teamID }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data, refetch }) => {
          if (loading) {
            return <Loading loading={loading} />;
          } else if (error) {
            return <div>Error: {error.message}</div>;
          }

          const { team } = data;

          return (
            <div className="container">
              <h3 className="cardText">{team.name}</h3>
              <hr style={{ borderColor: "#ED6E72" }} />
              {team.members.length ? (
                <div>
                  {this.renderTeam(team.leader, "leader")}
                  {this.renderTeam(team.members, "member")}
                </div>
              ) : (
                <div>
                  <h4 className="cardText">No Team Members Yet</h4>
                  {this.renderTeam(team.leader, "leader")}
                </div>
              )}

              <Button
                className="backButton"
                onClick={() => {
                  this.props.history.push("/dashboard");
                }}
                large
              >
                Back
              </Button>
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
                          this.findUserMutation(event);
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
                  trigger={<Button waves="light">Add Existing User</Button>}
                >
                  {this.renderModal("find")}
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
                          this.createUserMutation(event);
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
                  trigger={<Button waves="light">Create User</Button>}
                >
                  {this.renderModal("create")}
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
  graphql(query),

  graphql(existingUserToTeam, { name: "ExistingUserToTeam" }),
  graphql(createUser, { name: "CreateUser" })
)(ViewTeam);
