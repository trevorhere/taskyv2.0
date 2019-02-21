import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import query from "../gql/queries/Dashboard";
import Loading from "./Loading";
import { Card, CardTitle, Button, Row, Col } from "react-materialize";
import "../styles/App.css";

class Dashboard extends Component {
  renderList(items, link) {
    return items.map(({ id, name }) => {
      return (
        <li key={id} className="collection-item">
          <Link to={`/dashboard/${link}/${id}`}>{name}</Link>
        </li>
      );
    });
  }

  renderListCards(items, link) {
    return items.map(({ id, name, description }) => {
      return (
        <Col key={id} m={3} s={6}>
          {/* <Card
            className="white-text"
            style={{ backgroundColor: "#2A3335", color: "white" }}
            header={<CardTitle waves="light">Test</CardTitle>}
            title={name}
            onClick={() => {
              this.props.history.push(`/dashboard/${link}/${id}`);
            }}
          >
            {/* {description} */}
          {/* </Card> */}
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
    }
    const { teams, lists } = this.props.data.user;
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
          <Button href="/dashboard/createlist" className="">
            List
          </Button>
          <Button href="/dashboard/createteam" className="">
            Team
          </Button>
        </Button>
      </div>
    );
  }
}

export default graphql(query)(Dashboard);
