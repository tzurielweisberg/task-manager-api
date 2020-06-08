const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim:true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //module name
    ref: 'User'
  }
},
{
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)
// const Task = mongoosee.model('Task', {
//   description: {
//     type: String,
//     required: true,
//     trim:true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   },
//   owner: {
//     type: mongoosee.Schema.Types.ObjectId,
//     required: true,
//     //module name
//     ref: 'User'
//   }
// })


module.exports = Task;