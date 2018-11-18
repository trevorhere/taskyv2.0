import gql from 'graphql-tag';


export default gql`
  mutation DuplicateRecurringTask($taskID: ID, $status: String, $started: String, $finished: String){
    duplicateRecurringTask(taskID: $taskID, status: $status, started: $started, finished: $finished) {
      id
    }
  }
`;
