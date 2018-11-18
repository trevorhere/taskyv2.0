const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLNonNull } = graphql;

const UserType = require('./user_type');
const ListType = require('./list_type');
const TaskType = require('./task_type');
const TeamType = require('./team_type');

const List = mongoose.model('list');
const Task = mongoose.model('task');
const User = mongoose.model('user');
const Team = mongoose.model('team');


const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields:() => ({
    user: {
      type: UserType,
      resolve(parentValue, args, req){
        return req.user
      }
    },
    userID: {
      type: UserType,
      args: {userID: {type: GraphQLID}},
        resolve(parentValue, {userID}){
          return User.findById(userID);
        }
    },
    team: {
      type: TeamType,
      args: {teamID: {type: GraphQLID }},
        resolve(parentValue, {teamID}){
          return Team.findById(teamID);
        }
    },
    list: {
      type: ListType,
      args: {listID: { type:GraphQLID }},
        resolve(parentValue, {listID}){
          return List.findById(listID);
        }
    },
    task: {
      type: TaskType,
      args: {taskID: { type:  GraphQLID}},
      resolve(parentValue, {taskID}){
        return Task.findById(taskID);
      }
    }

  })
});

module.exports = RootQueryType;
