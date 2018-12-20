import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import query from '../gql/queries/Dashboard';
import Loading from './Loading';
import {Card, CardTitle,  Button} from 'react-materialize'
import '../styles/App.css';

class Dashboard extends Component {

  renderList(items, link){
    return items.map(({id, name}) => {
      return (
      <li key={id} className="collection-item">
        <Link to={`/dashboard/${link}/${id}`}>{name}</Link>
      </li>
      );
    });
  }

  renderListCards(items, link){
    return items.map(({id, name, description}) => {
      return (
        <div key={id} className="col s12 m4" >
        <Card style={{backgroundColor: "#2A3335"}}  header={
          <CardTitle  waves='light'/>}
          title={<h3 className="red-title">{name}</h3>}
          >
          {description}
          <div style={{display:'flex', flexDirection:"row", justifyContent:"flex-end" }}>
          <Button
              floating
              className='red'
              waves='light'
              icon="help"
              onClick={() => {
                this.props.history.push(`/dashboard/${link}/${id}`);
              }}
            />
            </div>
        </Card>
        </div>

        // <div key={id} className="col s12 m4">
        //  <div className="card sticky-action"  style={{backgroundColor: "#2A3335"}} >
        //   <span className="card-title" style={{padding: "10px"}}>   {name}</span>
        //   <div className="card-content">
        //       <p>
        //         {description}
        //       </p>
        //   </div>
        //   <div className="card-action">
        //     <a style={{color:"#ED6E72"}} className="viewLink" href={`/dashboard/${link}/${id}`}>View</a>
        //     <a style={{paddingLeft: "0",color:"grey"}} href={`/dashboard/${link}/${id}`}><i class="material-icons right">more_vert</i></a>
        //   </div>
        // </div>
        // </div>
      )
    })
  }

  render(){
    if(this.props.data.loading){
      return ( <Loading loading={this.props.data.loading} /> )
    }
    const { teams, lists } = this.props.data.user;
    return (
      <div className="container">
        <div >
          <h3 className="section-title">Your Lists: </h3>
          <div className="row" >
                {this.renderListCards(lists, "list")}
          </div>

          <Link
            to="/dashboard/createlist"
            className="outline right">
            Create List
          </Link>
        </div>
        <div style={{height: "100px"}}/>
        <div >
          <h3 className="section-title">Your Teams: </h3>
          <div className="row">
              {this.renderListCards(teams, "team")}
          </div>
          <br/>
          <br/>
          <Link
            to="/dashboard/createteam"
            className="outline right">
             Create Team
          </Link>
          <br/>
          <br/>
        </div>
      </div>
    )
  }
}

export default graphql(query)(Dashboard);