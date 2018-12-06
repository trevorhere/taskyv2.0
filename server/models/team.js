const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: { type: String },
  description: { type: String },
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
}, {usePushEach: true});



TeamSchema.statics.fetchMembers = function(id){
  return this.findById(id)
    .populate('members')
    .then(team => team.members);
}

TeamSchema.statics.createUser = function(email, password, name, position, teamID){
  const User = mongoose.model('user');

  return this.findById(teamID)
  .then(team => {
    const user = new User({email, password, name, position, team})
    team.members.push(user)

            return Promise.all([user.save(), team.save()])
          .then(([user, team]) => user);
  })
}

TeamSchema.statics.existingUserToTeam = function(email, teamID){
  const User = mongoose.model('user');
  return User.findOne({email})
    .then(user => {
      return this.findById(teamID)
      .then(team => {
        team.members.push(user);
        return Promise.all([user.save(), team.save()])
        .then(([user, team]) => user);
      })
    })
}

mongoose.model('team', TeamSchema);