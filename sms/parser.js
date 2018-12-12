const dotenv = require('dotenv');
dotenv.load();
const { createApolloFetch } = require('apollo-fetch');
const server = require('../config/server');

let SID =  process.env.TWILIO_SID;
let TOKEN = process.env.TWILIO_TOKEN;
let SENDER =   process.env.TWILIO_SENDER;

let client = require('twilio')(SID, TOKEN);

let secondCommand = null;
let thirdCommand = null;
let fourthCommand = null;
let selectedList = null;

const fetch = createApolloFetch({
  uri: `${server}/graphql`,
});

const helpScript = require('./scripts/helpScript');
const signupScript = require('./scripts/signupScript');

const { fetchLists, createList, deleteList } = require('./resolvers/list');
const { fetchTasks, createTask, deleteTask } = require('./resolvers/task');



exports.parse = (req, res) => {
  const { Body, From } = req.body;
  console.log( 'Body, From:', Body, From)

  let user = fetchUser(From);

  if(!user){
    sendSMS(signupScript, From);
    return;
  }

  let command = getCommand(Body);

  switch (command){

    // help
    case "?":
    sendSMS(helpScript, From);
    break;

    // fetch lists
    case "list":
    fetchLists(From, selectList);
    break;

    case "lists":
    fetchLists(From, selectedList);
    break;

    // add list
    case "add":
    createList(secondCommand, From);
    break;

    // remove list
    case "remove":
    deleteList(secondCommand, From);
    break;

    //add task
    case "plus": //send list after adding an item or removing item
    createTask(secondCommand, selectedList, From);
    break;

    // delete task
    case "minus":
    deleteTask(secondCommand,selectedList,  From);
    break;

    case "new":
    addNewUserTwilio(From);
    sendSMS('Thanks for trying out taskive, we\'ll call you shortly to verify your phone number', From);
    break;

    // case "working":
    // console.log('working hit')
    // //removeListSMS('+15598167525');
    // //addItemSMS('+15598167525','test');
    // //addItemSMS('+15598167525','john wick');
    // //removeItemSMS('+15598167525','test');
    // //viewListsItemsSMS('+15598167525');
    // //createUserSMS("Trevor", "Lane", '+15598167525');
    // //createListSMS("movies",'+15598167525');
    // //testingDB(secondCommand, '+15598167525')
    // //viewListsNamesSMS('+15598167525');
    // return null;

    // view tasks
    default:
    selectList(command)
    fetchTasks(command, From);
    break;
  }
}

let selectList = (list) => {
  selectedList = list;
  console.log('sl', selectedList)
};

let fetchUser = async function (phoneNumber){
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
    }).then(res => {
    //  console.log('fetchUser',res.data);
      return (res.data);
    }).catch(err =>{
      console.log(err);
      return null;
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

let getCommand = (text) => {

  if(!text || text == null)
  return "error";

  if(text.includes("create") || text.includes("Create"))
  {
      let message = text.split(" ");
      secondCommand = message[1];
      thirdCommand = message[2];
      let command = "adding user";

      return command;
  }

  let message = text.split(" ");

  if(message.length > 1)
  {
    command = message[0].toLowerCase();
    message.shift();
    secondCommand = message.join(" ");
  }
  else
  {
   command = message[0].toLowerCase();
  }


  console.log('command: ' +  command)
  return command;
}

let addNewUserTwilio = async (userNumber) => {
  client.validationRequests
    .create({
       friendlyName: userNumber,
       phoneNumber: userNumber
     })
    .then(validation_request => {
        console.log('VR length: ' + validation_request.length);
        for(let i = 0; i < validation_request.length; i ++)
        {
            console.log( i + ': ' + validation_request[i]);
        }
        console.log('validation code: ' + validation_request.friendly_name);
         sendSMS("You will be called shortly. VALIDATION CODE: " + validation_request.validation_code, userNumber)
      })
    .done();
}
