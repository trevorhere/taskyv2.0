import gql from 'graphql-tag';

export default gql`
mutation CreateUser($email:String, $password:String, $name: String, $phoneNumber: String,$position: String, $teamID: ID){
	createUser(email:$email, password: $password, name: $name, phoneNumber: $phoneNumber,position: $position, teamID:$teamID){
    id
    email
    name
    position
    phoneNumber
  }
}
`;