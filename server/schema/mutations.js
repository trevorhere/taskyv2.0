const graphql = require('graphql');
const mongoose = require('mongoose');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean
} = graphql;

const UserType = require('./types/user_type');
const ListType = require('./types/list_type');
const TeamType = require('./types/team_type');
const TaskType = require('./types/task_type');

const List = mongoose.model('list');
const User = mongoose.model('user');
const Team = mongoose.model('team');
const Task = mongoose.model('task');

const AuthService = require('../services/auth');

//future mutations
// - remove list
// - completed items?


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: {type: GraphQLString },
        name: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        position: {type: GraphQLString}

      },
      resolve(parentValue, {email, password, name,phoneNumber, position }, req ){
        return AuthService.signup({ email, password, name, phoneNumber, position, req });
      }
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req){
        const { user } = req;
        req.logout();
        return user;
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString},
        password: {type: GraphQLString}
      },
      resolve(parentValue, {email, password }, req){
        return AuthService.login({ email, password, req });
      }
    },
    createUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: {type: GraphQLString },
        name: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        position: {type: GraphQLString},
        teamID: {type: GraphQLID}
      },
      resolve(parentValue, {email, password, name, phoneNumber, position, teamID}){
        return Team.createUser(email, password, name, phoneNumber, position, teamID)
      }
    },
    existingUserToTeam: {
      type: UserType,
      args: {
        email: {type: GraphQLString},
        teamID: {type: GraphQLID}
      },
      resolve(parentValue, {email, teamID}){
        return Team.existingUserToTeam(email, teamID);
      }
    },
    assignListToUser: {
      type: UserType,
      args: {
        email : {type: GraphQLString},
        listID: {type: GraphQLID}
      },
      resolve(parentValue,{email, listID}){
        return List.assignUserToList(email, listID);
      }
    },
    createTeam: {
      type: TeamType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        leaderID: { type: GraphQLID }
      },
      resolve(parentValue, {name, description, leaderID }){
        return User.createTeam(name,description, leaderID)
      }
    },
    createTask: {
      type: ListType,
      args: {
        content: { type: GraphQLString },
        listID: {type: GraphQLID },
        status: { type: GraphQLString},
        creatorID: { type: GraphQLID },
        priority: {type: GraphQLInt},
        durationHours: {type: GraphQLInt},
        durationMinutes: {type: GraphQLInt},
        recurring: {type: GraphQLBoolean},
        notes: { type: GraphQLString},
        created: { type: GraphQLString},

       rdi: { type: GraphQLInt },
    death: { type: GraphQLInt },
    deathMultiplier: { type: GraphQLInt },
    rbi: { type: GraphQLInt },
    birth: { type: GraphQLInt },
    birthMultiplier: { type: GraphQLInt },
      },
      resolve(parentValue, {
        content,
        listID,
        status,
        creatorID,
        priority,
        durationHours,
        durationMinutes,
        notes,
        recurring,
        created,
        rdi,            
        death ,
        deathMultiplier,
        rbi           ,
        birth ,
        birthMultiplier,

      }){
        return List.createTask(
          content,
        listID,
        status,
        creatorID,
        priority,
        durationHours,
        durationMinutes,
        notes,
        recurring,
        created,
        rdi,            
        death ,
        deathMultiplier,
        rbi           ,
        birth ,
        birthMultiplier,
          )
      }
    },
    removeTask : {
      type: TaskType,
      args: {
        taskID: {type: GraphQLID}
      },
      resolve(parentValue, {taskID}){
        return Task.removeTask(taskID);
      }
    },
    setRecurringFalse:{
      type: TaskType,
      args: {
        taskID: {type: GraphQLID}
      },
      resolve(parentValue, {taskID}){
        return Task.setRecurringFalse(taskID);
      }
    },
    changeTaskStatus: {
      type: TaskType,
      args: {
        taskID: { type: GraphQLID },
        status: { type: GraphQLString },
        started: { type: GraphQLString },
        finished: { type: GraphQLString },
      },
      resolve(parentValue, {taskID, status, started, finished}){
        return Task.changeTaskStatus(taskID, status, started, finished);
      }
    },
    duplicateRecurringTask: {
      type: TaskType,
      args: {
        taskID: { type: GraphQLID },
        status: { type: GraphQLString },
        started: { type: GraphQLString },
        finished: { type: GraphQLString },
      },
      resolve(parentValue, {taskID, status, started, finished}){
        return Task.duplicateRecurringTask(taskID, status, started, finished);
    }
    },
    createList: {
      type: ListType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        ownerID: { type: GraphQLID }
      },
      resolve(parentValue, {ownerID, name, description}){
        return User.createList(ownerID, name, description);
      }
    },
    deleteList: {
      type: ListType,
      args: {
        listID: { type: GraphQLID }
      },
      resolve(parentValue, {listID}){
        return List.deleteList(listID);
      }
    }
  }
});

module.exports = mutation;