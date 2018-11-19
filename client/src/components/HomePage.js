import React, { Component } from 'react';
import {css} from 'react-emotion';
import background from "../assets/city.jpeg";
import { BarLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

// const componentStyle = css`
//   height: 80vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   text-align: ;center;
// `;

const componentStyle={
  //background: "url("+ background +") no-repeat center center fixed",
  background: "linear-gradient(rgba(20,20,20, .75), rgba(20,20,20, .75)),url( "+ background + ")",
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
                <BarLoader
                className={override}
                sizeUnit={"px"}
                size={10}
                color={'#F44336'}
                loading={this.props.loading}
              />
        </div>
      </div>
      );
  }
}

export default HomePage;