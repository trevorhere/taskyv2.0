import gql from 'graphql-tag';

export default gql`
query Task($taskID:ID!){
  task(taskID:$taskID){
    id
    content
    status
    priority
    durationHours
    durationMinutes
    notes
    feedback
    started
    finished
    recurring
    created
    rdi
    death
    deathMultiplier
      rbi
    birth
    birthMultiplier

  }
}
`;