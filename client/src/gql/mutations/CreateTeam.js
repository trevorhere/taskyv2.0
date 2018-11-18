import gql from 'graphql-tag';

export default gql`
mutation CreateTeam($name: String, $leaderID: ID){
  createTeam(name:$name, leaderID: $leaderID){
    id
    name
  }
}
`;