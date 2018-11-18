import gql from 'graphql-tag';

export default gql`
mutation RemoveTask($taskID:ID){
	removeTask(taskID:$taskID){
    id
  }
}
`;