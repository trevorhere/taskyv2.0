import gql from 'graphql-tag';

export default gql`
 mutation CreateList($name:String, $description:String,$ownerID:ID){
  createList(name:$name, description: $description ownerID:$ownerID){
  	id
  }
}
`;