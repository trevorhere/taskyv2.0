import gql from 'graphql-tag';

export default gql`
mutation CreateUser($email:String, $password:String, $name: String, $position: String, $teamID: ID){
	createUser(email:$email, password: $password, name: $name, position: $position, teamID:$teamID){
    id
    email
    name
    position
  }
}
`;