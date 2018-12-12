import gql from 'graphql-tag';

export default gql`
mutation DeleteList($listID: ID){
  deleteList(listID: $listID){
    id
    name
  }
}
`;