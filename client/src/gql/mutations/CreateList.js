import gql from 'graphql-tag';

export default gql`
 mutation CreateList($name:String,$ownerID:ID){
  createList(name:$name, ownerID:$ownerID){
  	id
  }
}
`;