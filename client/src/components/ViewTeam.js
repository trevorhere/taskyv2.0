import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {  Query } from 'react-apollo';
import query from '../gql/queries/fetchTeam';
import Loading from './Loading';
import {Card, CardTitle, Button} from 'react-materialize'


class ViewTeam extends Component{



  renderListCards(team){
    return team.members.map(({id, name, position}) => {
      return (
        <div key={id} className="col s12 m4" >
        <Card style={{backgroundColor: "#2A3335"}}  header={
          <CardTitle  waves='light'/>}
              title={<span style={{color:"#070808"}}>{name}</span>}>
             <span><span style={{ fontSize: "16px", fontWeight:"bold"}}>Position</span>: {position}</span>
          <br/>
          <br/>
          <br/>
          <br/>
          <div style={{display:'flex', flexDirection:"row", justifyContent:"flex-end" }}>
            <Button
              floating
              className='red'
              waves='light'
              icon="help"
              onClick={this.viewProfile(team, id)}
            />
          </div>
        </Card>
        </div>
      )
    })
  }

  viewProfile(team, id){
    return (() => {
      console.log('test')
      this.props.history.push(`/dashboard/team/${team.id}/user/${id}`)
     }
    )
  }

  renderTeam(team){
    return ( team.members ? team.members.map(({id, name, position }) => {
      return (
      <li key={id} className="collection-item ">
        <Link to={`/dashboard/team/${team.id}/user/${id}`} >{name}</Link>
        <div className="right">
        position: {position}
        </div>
      </li>
      )
    }) :
    <div> There are no members on this team. </div>

    )
  }


  render(){
    if(this.props.data.loading){
      return (<Loading loading={this.props.data.loading}/>);
    }
    return (
      <Query
        query={query}
        variables={{ teamID: this.props.match.params.teamID}}
        fetchPolicy="cache-and-network"
      >
        {({loading, error, data, refetch }) => {

          if (loading) {
            return (<Loading loading={loading}/>);
          } else if (error) {
            return <div>Error: {error.message}</div>;
          }

          const { team } = data;
          return (
            <div className="container">
            <h3 className="section-title">{team.name}</h3>
            <div className="row" >
                {this.renderListCards(team)}
          </div>
              <div style={{marginTop: "10px"}}>
              <Link
                to={`${this.props.match.url}/createuser`}
                className="outline right"
                style={{margin: "10px"}}
              >
                Add Member To Team
              </Link>
              <Link
                to={`/dashboard`}
                style={{margin: "10px"}}
                className=" outline right">Back</Link>
                </div>
          </div>
          );
        }}
      </Query>
    )
  }
}

export default ViewTeam;
