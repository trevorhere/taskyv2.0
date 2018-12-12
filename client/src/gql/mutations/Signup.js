import gql from 'graphql-tag';

export default gql`
mutation Signup($email:String, $password:String, $name: String, $position: String, $phoneNumber: String){
	signup(email:$email, password: $password, name: $name, position: $position, phoneNumber: $phoneNumber){
    id
    email
    name
  }
}
`;