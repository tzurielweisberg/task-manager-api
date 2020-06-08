const express = require('express');
require('./db/mogoose');

const User = require('./models/user');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const Task = require('./models/task');
//const Task = mongoose.model('./models/task');

const app = express();
const port = process.env.PORT// || 3000 added it to config

// app.use((req, res, next) => {
//   // console.log(req.method, req.path);
//   // next();
//   if (req.method === 'GET'){
//     res.send('GET are disable')
//   }
//   else {
//     next();
//   }
  
// });

// app.use((req,res,next)=>{
//   res.status(503).send('Site is currently down, try again soon.')
// })



// const multer = require('multer');
// const upload = multer({
//   dest: 'images',
//   limits: {
//     //1 mb
//     fileSize: 1000000
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)){
//       return cb (new Error('please upload a word doc'))
//     }
//     cb(undefined, true)
//     // cb(new Error('file should be docx'));
//     // cb(undefined, true);
//     // cb(undefined, false);

//   }
// })

// // const errorMiddleware = (req, res, next)=>{
// //   throw new Error('from my middleware')
// // } 
// app.post('/upload',upload.single('upload') , (req,res) =>{
//   res.send()
// }, (error, req, res, next)=>{
//   res.status(400).send({error: error.message});
// })

app.use(express.json())
app.use(userRouter);
app.use(taskRouter);


//
// without middleware: new request -> run route handler
//
//With middleware: new request -> do something -> nun route handler
//


app.listen(port, () => {
  console.log('Server is up on port ' + port);

})


// const jwt = require('jsonwebtoken');
// const myFunc = async ()=>{
  
//   //jwt
//   const token = jwt.sign({ _id: '123abc' }, 'thisismynewcourse', {expiresIn: '7 days'})
//   console.log(token);

//   const data = jwt.verify(token,'thisismynewcourse' )

//   console.log(data);
  
  
  
//   //bcrypt
//   // const password = 'Red12345!';
//   // //number is amount of rounds the algorithm works (8 will not tak too long, but is enough secure)
//   // const hashedPassword = await bcryptjs.hash(password, 8);
//   // console.log(password);
//   // console.log(hashedPassword);
  
//   // const isMatch = await bcryptjs.compare('red12345!',hashedPassword )
//   // console.log(isMatch);
  
// }

// myFunc()

// const pet = {
//   name: 'Hal'
// }

// pet.toJSON = function () {
// return {};
  
// }

// console.log(JSON.stringify(pet))


//const Task = require('./models/task')
// const main = async () => {
//   // const task = await Task.findById('5ed93f7599823833a43b8f9c');
//   // await task.populate('owner').execPopulate();
//   // console.log(task.owner);

//   const user = await User.findById('5ed93e93e67dc0118cf11eb3');
//   await user.populate('tasks').execPopulate();
//   console.log(user.tasks);
  
  
// }

// main();