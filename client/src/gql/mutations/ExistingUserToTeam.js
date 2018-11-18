import gql from 'graphql-tag';

export default gql`
mutation ExistingUserToTeam($email:String, $teamID: ID){
	existingUserToTeam(email:$email teamID:$teamID){
    id
    email
    name
    position
  }
}
`;