import gql from 'graphql-tag';

export default gql`
  query UserID($userID:ID){
    userID(userID:$userID){
      id
      name
      position
      email
      lists{
        id
        name
        tasks {
          id
          content
          status
        }
      }
    }
  }

`;