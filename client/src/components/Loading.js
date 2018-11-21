import React, {Component} from 'react';
import { css } from 'react-emotion';
import { BarLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const componentStyle = css`
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: ;center;
`;


class Loading extends Component {
  constructor(props){
    super(props)
  }

  render(){
      return (
        <div className={componentStyle} >
        <BarLoader
        manLoader
        className={override}
        sizeUnit={"px"}
        size={20}
        color={'#F44336'}
        loading={this.props.loading}
      />
    </div>
      )
}
}

export default Loading;