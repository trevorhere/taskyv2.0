import gql from 'graphql-tag';


export default gql`
  mutation ChangeTaskStatus($taskID: ID, $status: String, $started: String, $finished: String){
    changeTaskStatus(taskID: $taskID, status: $status, started: $started, finished: $finished) {
      id
    }
  }
`;
