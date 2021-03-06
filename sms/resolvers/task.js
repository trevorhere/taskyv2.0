const server = require('../../config/server');
const { createApolloFetch } = require('apollo-fetch');
const fetch = createApolloFetch({
  uri: `${server}/graphql`,
});
const signupScript = require('../scripts/signupScript');
const errorScript = require('../scripts/errorScript');
const moment = require('moment');



let SID =  process.env.TWILIO_SID;
let TOKEN = process.env.TWILIO_TOKEN;
let SENDER =   process.env.TWILIO_SENDER;

let client = require('twilio')(SID, TOKEN);

exports.fetchTasks = async (name, phoneNumber) => {
  fetch({
     query: `query UserSMS($phoneNumber: String) {
       userSMS(phoneNumber: $phoneNumber) {
         id
         email
         name
         position
         lists {
           id
           name
           tasks {
             id
             content
           }
         }
       }
     }
     `,
     variables: { phoneNumber },
   })
   .then(res => {
     if(!res.data.userSMS){
        sendSMS(signupScript,phoneNumber);
        return;
      }

     let list = res.data.userSMS.lists.filter((list) =>{
        return list.name == name;
     });

     console.log('list', list);

     if(list.length <= 0 || !list){
      sendSMS(`List ${name} not found.`, phoneNumber);
      return;
     }

     if(!list[0].tasks.length){
      sendSMS(`List ${name} has no tasks yet.`, phoneNumber);
      return;
     }

     let tasks = list[0].tasks.map(({content}) => {
        return content;
     })

     sendSMS((`${name}:\n${tasks.join('\n')}`),phoneNumber);

    })
    .catch(err =>{
     console.log(err);
     sendSMS(errorScript,phoneNumber);
     return;
   });
};

exports.deleteTask = async (task, name, phoneNumber) => {
  fetch({
     query: `query UserSMS($phoneNumber: String) {
       userSMS(phoneNumber: $phoneNumber) {
         id
         email
         name
         position
         lists {
           id
           name
           tasks {
             id
             content
           }
         }
       }
     }
     `,
     variables: { phoneNumber },
   })
   .then(res => {
     if(!res.data.userSMS){
        sendSMS(signupScript,phoneNumber);
        return;
      }

     let list = res.data.userSMS.lists.filter((list) =>{
        return list.name == name;
     });


     console.log('list', list);

     if(list.length <= 0 || !list){
     console.log('1');
      sendSMS(`Please select a list before you delete a task.`, phoneNumber);
      return;
     }

     let taskToDelete = list[0].tasks.filter(item => {
        return item.content == task;
     })

     if(taskToDelete.length <= 0 || !taskToDelete){
     console.log('2');
      sendSMS(`We couldn't find that task, please try again.`, phoneNumber);
      return;
     }

     fetch({
      query: `
      mutation RemoveTask($taskID:ID){
        removeTask(taskID:$taskID){
          id
        }
      }
      `,
      variables: {
        taskID: taskToDelete[0].id
      },
    }).then(queryResult => {
        console.log('qr', queryResult)
      sendSMS((`Task: ${task} deleted`),phoneNumber);
    }).catch(err =>{
      console.log(err);
      sendSMS(errorScript,phoneNumber);
      return;
    });
  })
};

exports.createTask = async (task, name, phoneNumber) => {
  fetch({
     query: `query UserSMS($phoneNumber: String) {
       userSMS(phoneNumber: $phoneNumber) {
         id
         email
         name
         position
         lists {
           id
           name
           tasks {
             id
             content
           }
         }
       }
     }
     `,
     variables: { phoneNumber },
   })
   .then(res => {
     if(!res.data.userSMS){
        sendSMS(signupScript,phoneNumber);
        return;
      }

     let list = res.data.userSMS.lists.filter((list) =>{
        return list.name == name;
     });

     console.log('list', list);

     if(list.length <= 0 || !list){
      sendSMS(`List ${name} not found.`, phoneNumber);
      return;
     }

     fetch({
      query: `
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
        }
      }
    }
      `,
      variables: {
        content: task,
        listID:list[0].id,
        status: "pending",
        creatorID: res.data.userSMS.id,
        rank: "",
        priority:1,
        durationHours: 0,
        durationMinutes: 0,
        notes:"",
        recurring: false,
        created: moment().format('MM/DD/YY, HH:mm'),
       rdi: 0,
  death: 0,
  deathMultiplier: 1,
  rbi: 0,
  birth: 0,
  birthMultiplier: 1,
      },
    }).then(queryResult => {
        console.log('qr', queryResult)
      sendSMS((`Task: ${task} added to ${queryResult.data.createTask.name}`),phoneNumber);
    }).catch(err =>{
      console.log(err);
      sendSMS(errorScript,phoneNumber);
      return;
    });
  })
};

async function fetchUser(phoneNumber){
  return await fetch({
      query: `query UserSMS($phoneNumber: String) {
        userSMS(phoneNumber: $phoneNumber) {
          id
          email
          name
          position
          lists {
            id
            name
          }
        }
      }
      `,
      variables: { phoneNumber },
    }).then(res => {
      console.log('fetch user list: ',res);
      return (res.data);
    }).catch(err =>{
      console.log(err);
      sendSMS(errorScript,phoneNumber);
      return;
    });

 };


 let sendSMS = (body, userNumber) => {
   try {
       client.messages
       .create({
          body: body,
          from: SENDER,
          to: userNumber
        })
       .then(message => console.log(message.sid))
       .done();
   } catch (err){
       console.log("error in sendSMS: " + err);

   }
 };
