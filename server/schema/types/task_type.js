const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} = graphql;

const Task = mongoose.model('task');

const TaskType = new GraphQLObjectType({
  name:  'TaskType',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    status: { type: GraphQLString },
    priority: {type: GraphQLInt},
    durationHours: { type: GraphQLInt },
    durationMinutes: { type: GraphQLInt },
    notes: { type: GraphQLString },
    feedback: { type: GraphQLString },
    dueDate: {type: GraphQLString},
    timeDue: {type: GraphQLString},
    started: {type: GraphQLString},
    finished: {type: GraphQLString},
    recurring: {type: GraphQLBoolean},
    created:{type: GraphQLString},
    rdi: { type: GraphQLInt },
    death: { type: GraphQLInt },
    deathMultiplier: { type: GraphQLInt },
    rbi: { type: GraphQLInt },
    birth: { type: GraphQLInt },
    birthMultiplier: { type: GraphQLInt },
    

    creator: {
      type: require('./user_type'),
      resolve(parentValue){
        return Task.findById(parentValue).populate('creator')
          .then(task => {
            return task.creator;
          });
      }
    },
     owner: {
      type: require('./user_type'),
      resolve(parentValue){
        return Task.findById(parentValue).populate('owner')
          .then(task => {
            return task.owner;
          });
      }
    },
    list: {
      type: require('./list_type'),
      resolve(parentValue) {
        return Task.findById(parentValue).populate('list')
          .then(task => {
            return task.list
        })
      }
    }
  })
});

module.exports = TaskType;


