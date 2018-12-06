import gql from 'graphql-tag';

export default gql`
mutation CreateTeam($name: String, $description: String $leaderID: ID){
  createTeam(name:$name, description:$description leaderID: $leaderID){
    id
    name
  }
}
`;