import gql from 'graphql-tag';

export default gql`
query Team($teamID:ID){
    team(teamID:$teamID){
      id
      name
      members{
        id
        name
        position
        phoneNumber
      }
    leader{
      id
      name
      position
    }
    }
  }
`;