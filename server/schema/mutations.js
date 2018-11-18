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
// - remove items
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
        position: {type: GraphQLString}

      },
      resolve(parentValue, {email, password, name, position }, req ){
        return AuthService.signup({ email, password, name, position, req });
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
        position: {type: GraphQLString},
        teamID: {type: GraphQLID}
      },
      resolve(parentValue, {email, password, name, position, teamID}){
        return Team.createUser(email, password, name, position, teamID)
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
        leaderID: { type: GraphQLID }
      },
      resolve(parentValue, {name, leaderID }){
        return User.createTeam(name, leaderID)
      }
    },
    createTask: {
      type: ListType,
      args: {
        content: { type: GraphQLString },
        listID: {type: GraphQLID },
        status: { type: GraphQLString},
        creatorID: { type: GraphQLID },
        rank: {type: GraphQLString},
        priority: {type: GraphQLInt},
        dueDate: {type: GraphQLString},
        timeDue: {type: GraphQLString},
        started: {type: GraphQLString},
        finished: {type: GraphQLString},
        durationHours: {type: GraphQLInt},
        durationMinutes: {type: GraphQLInt},
        recurring: {type: GraphQLBoolean},
        kill: {type: GraphQLInt},
        repeat: {type: GraphQLInt},
        notes: { type: GraphQLString},
        created: { type: GraphQLString},
        recurringInterval: { type: GraphQLInt },
        recurringMultiplier:{type: GraphQLString},
        recurringDeathNumber:{ type: GraphQLInt },
        recurringDeathMultiplier:{type: GraphQLString},
      },
      resolve(parentValue, {
        content,
        listID,
        status,
        creatorID,
        rank,
        priority,
        dueDate,
        timeDue,
        started,
        finished,
        durationHours,
        durationMinutes,
        notes,
        recurring,
        kill,
        repeat,
        created,
        recurringInterval,
        recurringMultiplier,
        recurringDeathNumber,
        recurringDeathMultiplier

      }){
        return List.createTask(
          content,
          listID,
          status,
          creatorID,
          rank,
          priority,
          dueDate,
          timeDue,
          started,
          finished,
          durationHours,
          durationMinutes,
          notes,
          recurring,
          kill,
          repeat,
          created,
          recurringInterval,
        recurringMultiplier,
        recurringDeathNumber,
        recurringDeathMultiplier
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
        ownerID: { type: GraphQLID }
      },
      resolve(parentValue, {ownerID, name}){
        return User.createList(ownerID, name);
      }
    }
  }
});

module.exports = mutation;