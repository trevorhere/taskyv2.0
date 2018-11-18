const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql;


const List = mongoose.model('list');
const TaskType = require('./task_type');
const UserType = require('./user_type');



const ListType = new GraphQLObjectType({
  name: 'ListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    notes: { type: GraphQLString },
    feedback: { type: GraphQLString },
    leader: {
      type: require('./user_type'),
      resolve(parentValue){
        return List.findById(parentValue).populate('leader')
          .then(list => {
            return list.leader;
          });
      }
    },
    owner: {
      type: require('./user_type'),
      resolve(parentValue){
        return List.findById(parentValue).populate('owner')
          .then(list => {
            return list.owner;
          });
      }
    },
    tasks: {
      type: GraphQLList(TaskType),
      resolve(parentValue) {
        return List.findTasks(parentValue.id);
      }
    }
  })
});

module.exports = ListType;
