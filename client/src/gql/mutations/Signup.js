import gql from 'graphql-tag';

export default gql`
mutation Signup($email:String, $password:String, $name: String, $position: String){
	signup(email:$email, password: $password, name: $name, position: $position){
    id
    email
    name
  }
}
`;