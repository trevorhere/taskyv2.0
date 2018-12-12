const graphql = require('graphql');
const mongoose = require('mongoose');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql;

const ListType = require('./list_type');
const TeamType = require('./team_type');

const User = mongoose.model('user');
const Team = mongoose.model('team');


const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: {type: GraphQLID },
    email: { type: GraphQLString },
    name: {type: GraphQLString},
    phoneNumber: {type: GraphQLString},
    position: {type: GraphQLString},
    team: {
      type: TeamType,
      resolve(parentValue){
        return User.findById(parentValue).populate('team')
          .then(user => {
            return user.team;
        });
      }
    },
    teams: {
      type: GraphQLList(TeamType),
      resolve(parentValue){
        return User.fetchTeams(parentValue.id);
      }
    },
    lists: {
      type: GraphQLList(ListType),
      resolve(parentValue){
        return User.fetchLists(parentValue.id);
      }
    }
  }
});

module.exports = UserType;