const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql;

const UserType = require('./user_type');
const User = mongoose.model('user');
const Team = mongoose.model('team');

const TeamType = new GraphQLObjectType({
  name: 'TeamType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString},
    leader: {
      type: require('./user_type'),
      resolve(parentValue){
        return Team.findById(parentValue).populate('leader')
          .then(team => {
            return team.leader;
          });
      }
    },
    members: {
      type: GraphQLList(require('./user_type')),
      resolve(parentValue) {
        return Team.fetchMembers(parentValue.id);
      }
    }
  })
});

module.exports = TeamType;