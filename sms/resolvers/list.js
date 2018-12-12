const server = require('../../config/server');
const { createApolloFetch } = require('apollo-fetch');
const fetch = createApolloFetch({
  uri: `${server}/graphql`,
});
const signupScript = require('../scripts/signupScript');
const errorScript = require('../scripts/errorScript');


let SID =  process.env.TWILIO_SID;
let TOKEN = process.env.TWILIO_TOKEN;
let SENDER =   process.env.TWILIO_SENDER;

let client = require('twilio')(SID, TOKEN);

exports.fetchLists = async (phoneNumber, selectedList) => {
  console.log('sl', selectedList)
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

     let listNames = res.data.userSMS.lists.map(({name}) =>{
        let result = name;

        if(name === selectedList){
          result += " *";
        }

        return result;
     });
     // return ( `Lists: \n ${listNames.join('')}`);
     sendSMS((`Lists:\n${listNames.join('\n')}`),phoneNumber);

    })
    .catch(err =>{
     console.log(err);
     sendSMS(errorScript,phoneNumber);
     return;
   });
};

exports.createList = async (name, phoneNumber) => {
  try {
    let userData = await fetchUser(phoneNumber)

    if(!userData.userSMS){
      sendSMS(signupScript,phoneNumber);
      return;
    }
      fetch({
      query: `mutation CreateList($name:String, $description:String,$ownerID:ID){
        createList(name:$name, description: $description ownerID:$ownerID){
          id
          name
        }
      }
      `,
      variables: { name, description: '', ownerID: userData.userSMS.id},
    }).then(queryResult => {
      sendSMS((`List ${queryResult.data.createList.name} added`),phoneNumber);
    }).catch(err =>{
      console.log(err);
      sendSMS(errorScript,phoneNumber);
      return;
    });
  } catch(err) {
    console.error(err);
    sendSMS(errorScript,phoneNumber);
    return;
}
};


exports.deleteList = async (name, phoneNumber) => {

  try {
    let userData = await fetchUser(phoneNumber)

    if(!userData.userSMS){
      sendSMS(signupScript,phoneNumber);
      return;
    }

    listToDelete = userData.userSMS.lists.filter(list =>  {
      return list.name == name;
    })

    if(listToDelete.length <= 0){
      sendSMS(`List ${name} not found.`,phoneNumber);
      return;
    }

    console.log('ltd ',listToDelete[0].id);

    fetch({
      query: `mutation DeleteList($listID: ID){
        deleteList(listID: $listID){
          id
          name
        }
      }
      `,
      variables: { listID: listToDelete[0].id},
    }).then(queryResult => {
      console.log(queryResult)
      sendSMS((`List ${queryResult.data.deleteList.name} removed`),phoneNumber);
    }).catch(err =>{
      console.log(err);
      sendSMS(errorScript,phoneNumber);
      return;
    });
  } catch(err) {
    console.error(err);
    sendSMS(errorScript,phoneNumber);
    return;
}
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