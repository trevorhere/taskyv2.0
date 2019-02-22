import gql from 'graphql-tag';
export default gql`
 mutation CreateTask(
  $content:String,
  $listID:ID,
  $status: String,
  $creatorID: ID,
  $priority:Int,
  $durationHours:Int,
  $durationMinutes:Int,
  $notes:String, 
  $recurring: Boolean
  $created: String,
  $rdi:             Int,
  $death:           Int,
  $deathMultiplier: Int,
  $rbi:              Int,
  $birth:           Int,
  $birthMultiplier: Int,
	){
  createTask(
    content:$content,
    listID:$listID,
    status: $status,
    creatorID: $creatorID,
  	priority:$priority,
  	durationHours:$durationHours,
  	durationMinutes:$durationMinutes,
  	notes:$notes,
    recurring: $recurring
    created: $created,
    rdi:            $rdi,               
    death:          $death,         
    deathMultiplier:$deathMultiplier,
    rbi:            $rbi          ,
    birth:          $birth         ,
    birthMultiplier:$birthMultiplier,
  	){
  	id
    name
    tasks{
      id
      content
      status
      notes

    }
  }
}
`;