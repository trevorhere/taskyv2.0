import React, {Component} from 'react';
import {Col, CardPanel, Row } from 'react-materialize'


class SMSInstructions extends Component {
  render(){
    return(
    <div  >
      <Row>
          <Col s={12} m={6} offset={"m3"} styles={{marginTop: "20vh"}}>
            <CardPanel className="grey darken-3 black-text">
              <span>
                <h3 className="section-title"> Using SMS with your lists</h3>
                  <p>
                    To use Taskyv SMS functionality, add +1 (385) 290 4244 to your contact list in your cell phone using the name Taskyv.
                  </p>
                  <p>
                    Now that you have signed up for an account, you can text Taskyv to update your lists.
                  </p>
                  <p>
                    Text '?' to Taskyv for a list of available commands!
                  </p>
              </span>
            </CardPanel>
          </Col>
      </Row>
    </div>
    )}
}

export default SMSInstructions;