import React, { Component } from 'react';
import {css} from 'react-emotion';
import background from "../assets/city.jpeg";

const componentStyle={
  background: "url("+ background +") no-repeat center center fixed",
  height: "93vh",
  backgroundSize: "cover",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",

}
const headerStyle = {}
const titleStyle={
  color:"#ED6E72",
  fontSize: "64px",
  fontWeight: "100"

}
const subtitleStyle={
  color:"#ED6E72",
  fontSize: "24px",
  width: "60vw",
}


class HomePage extends Component {

  render(){
    return (
      <div style={componentStyle}>
        <div style={headerStyle}>
            <h3 style={titleStyle} >W E L C O M E</h3>
        </div>
      </div>
      );
  }
}

export default HomePage;