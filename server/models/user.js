const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  email: String,
  password: String,
  name: String,
  position: String,
  team: {
    type: Schema.Types.ObjectId,
    ref: 'team'
  },
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'team',
  }],
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'list'
  }]
}, {usePushEach: true});


UserSchema.statics.createTeam = function(name, description, leaderID){
  const Team = mongoose.model('team');

  return this.findById(leaderID)
  .then(leader => {
    const team = new Team({name, description, leader});
    leader.teams.push(team);
    return Promise.all([team.save(), leader.save()])
      .then(([team, leader]) => team);
  })
}

UserSchema.statics.fetchTeams = function(id){
  return this.findById(id)
    .populate('teams')
    .then(user => user.teams);
}


UserSchema.statics.createList = function(id, name, description){
  const List = mongoose.model('list');
  return this.findById(id)
    .then(user => {
      const list = new List({ name, user, description })
      console.log(list)
      user.lists.push(list)
      return Promise.all([list.save(), user.save()])
        .then(([list, user]) => user);
    });
}

UserSchema.statics.fetchLists = function(id){
  return this.findById(id)
    .populate('lists')
    .then(user => user.lists);
}


UserSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

mongoose.model('user', UserSchema);
