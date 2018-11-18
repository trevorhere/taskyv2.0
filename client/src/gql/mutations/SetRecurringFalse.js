import gql from 'graphql-tag';

export default gql`
  mutation SetRecurringFalse($taskID: ID){
    setRecurringFalse(taskID: $taskID) {
      id
    }
  }
`;
