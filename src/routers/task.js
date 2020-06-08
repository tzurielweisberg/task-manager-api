const express = require('express')
const router = new express.Router();
const auth = require('../middleware/auth')
const Task = require('../models/task');


router.post('/tasks', auth, async (req, res) => {
  console.log(req.body);
  
  //const task = new Task(req.body);
  const task = new Task({
    //copy all the parameters to the new object - es6 
    ...req.body,
    owner: req.user._id

  })
  try {
    await task.save();
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})


// GET /tasks?completed=false/true
// GET /tasks?limit=10(/50/100)&skip=10(from11-20..)  (limit and skipped)
// GET /tasks?sortBY=createdAt:asc/desc
router.get('/tasks', auth, async (req, res) => {
  //starts empth
  const match = {};
  const sort = {};
  if (req.query.completed){
    //not a boolean, a string
    //match.completed = req.query.completed
    match.completed = req.query.completed === 'true'
  }
  console.log('sort = ' + req.query.sortBy);

  if (req.query.sortBy){
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    //const tasks = await Task.find({owner: req.user._id});
    //await req.user.populate('tasks').execPopulate();
    await req.user.populate({
      path: 'tasks',
      //using match
      match,
      //: {
      //  completed: false
      //},
      options: {
        //ignored if empty or not a number
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
        // : {
        //   //Asc is 1 desc is -1
        //   //createdAt: 1
        //   completed: -1

        // }
      }
    }).execPopulate();
    res.send(req.user.tasks)
    //res.send(tasks)
  } catch (error) {
    res.status(500).send();
  }

})


router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    
    //const task = await Task.findById(_id);
    const task = await Task.findOne({_id, owner: req.user._id})
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }

})

router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  const allowedUpdates = ['description', 'completed'];
  const updates = Object.keys(req.body);

  const isUpdateAllowed = updates.every((update) =>
    allowedUpdates.includes(update)
  )
  if (!isUpdateAllowed) {
    return res.status(400).send({ error: "Invalid update" });
  }

  try {
   
   //const task = await Task.findById(_id);
   const task = await Task.findOne({_id, owner: req.user._id})
   

    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update)=>{
      task[update] = req.body[update];
    })
    await task.save();

    res.send(task);

  } catch (error) {
    res.status(400).send(error);
  }
})


router.delete('/tasks/:id', auth, async (req,res) => {
  try {
    //const task = await Task.findByIdAndDelete(req.params.id)
    const _id = req.params.id;
    const task = await Task.findOneAndDelete({_id, owner: req.user._id});
    if(!task){
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
})

module.exports = router;
