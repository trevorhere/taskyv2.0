const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  name: { type: String },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  notes: { type: String },
  description: { type: String },
  feedback: { type: String },
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'task'
  }],
}, {usePushEach: true});

ListSchema.statics.createTask = function(
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
      ){
  const Task = mongoose.model('task');
    return this.findById(listID)
      .then(list => {
        const task = new Task({
          content,
          list,
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
    birthMultiplier, })

    console.log('new task: ', task)
        list.tasks.push(task)
        return Promise.all([task.save(), list.save()])
          .then(([task, list]) => list);
      });
}

ListSchema.statics.findTasks = function(id){
  return this.findById(id)
    .populate('tasks')
    .then(list => list.tasks);
}

ListSchema.statics.assignUserToList = function(email, listID){
  const User = mongoose.model('user');
  return User.findOne({email})
  .then(user => {
    return this.findById(listID)
    .then(list => {
      user.lists.push(list);
      return Promise.all([list.save(), user.save()])
      .then(([list, user]) => user);

    })
  })

}

ListSchema.statics.deleteList = function(listID){
  return this.findById(listID)
  .then(list => {
    list.remove();
    return list;
})
}


mongoose.model('list', ListSchema);