import gql from 'graphql-tag';

export default gql`
mutation AssignListToUser($email:String, $listID:ID){
  assignListToUser(email:$email, listID:$listID){
    id
    name
  }
}

`;