const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  content: { type: String },
  list: {
    type: Schema.Types.ObjectId,
    ref: 'list'
  },
  status: { type: String },
  created: { type: String },
  notes: { type: String },
  feedback: { type: String },
  priority: {type: Number},
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  recurring: {type: Boolean},
  dueDate: {type:String},
  timeDue: {type:String},
  started: {type: String},
  finished: {type: String},
  durationHours: { type: Number },
  durationMinutes: { type: Number },
  rdi: { type: Number },
  death:  { type: Number },
  deathMultiplier:  { type: Number }, 
  rbi: { type: Number },
  birth:  { type: Number },
  birthMultiplier:  { type: Number },


});

TaskSchema.statics.setRecurringFalse = function(taskID){
  return this.findById(taskID)
  .then(task => {
    task.recurring = false;
    return Promise.all([task.save()])
    .then(([task]) => task);
  })
}

TaskSchema.statics.changeTaskStatus = function(taskID, status, started, finished){
      console.log('task', taskID);
      console.log('status', status);


  return this.findById(taskID)
    .then(task => {
        task.status = status;
        task.started = started;
        task.finished = finished;
        return Promise.all([task.save()])
        .then(([task]) => task);
      })
}
TaskSchema.statics.duplicateRecurringTask = function(taskID, status, started, finished){
  const taskModel = mongoose.model('task');
  console.log('save hit')
  return this.findById(taskID)
    .then(task => {
      const newTask = new taskModel({
        status,
        started,
        finished,
        content: task.content,
        list: task.list,
        created: task.created,
        notes: task.notes,
        feedback: task.feedback,
        priority: task.priority,
        creator: task.creator,
        owner: task.owner,
        recurring: false,
        dueDate: task.dueDate,
        timeDue: task.timeDue,
        durationHours: task.durationHours,
        durationMinutes: task.durationMinutes,
        rdi:             task.rdi              ,
        death:           task.death            ,
        deathMultiplier: task.deathMultiplier   , 
        rbi:             task.rbi             ,
        birth:           task.birth            ,
        birthMultiplier: task.birthMultiplier   ,
      })
      return Promise.all([newTask.save()])
      .then(([task]) => task);
    })

}

TaskSchema.statics.removeTask = function(taskID){
  return this.findByIdAndRemove(taskID)
  .then(task => {
    return Promise.all([task.save()])
    .then(([task]) => task);
  })


}

mongoose.model('task', TaskSchema);