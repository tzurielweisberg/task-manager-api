const express = require('express')
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth')
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendcancelationEmail} = require('../emails/account')

// router.get('/test', (req,res)=>{
//   res.send('this is nnnew file')
// })


router.post('/users', async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken();
    //wont continue if error
    res.status(201).send({user, token});
  } catch (e) {
    res.status(400).send(e);
  }

  // user.save().then(()=>{
  //   res.status(201).send(user);

  // }).catch((error)=>{
  //   res.status(400).send(error);

  // })

});

router.post('/users/login', async (req, res)=>{
  try {    
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({user, token});
  } catch (error) {
    res.status(400).send();
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token
    }) 
    await req.user.save()
    res.send();
  } catch (error) {
    res.status(500).send();
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save()
    res.send();
  } catch (error) {
    res.status(500).send();
  }
})

router.get('/users/me',auth ,async (req, res) => {
  res.send(req.user)
  // try {
  //   const users = await User.find({});
  //   res.send(users)
  // } catch (error) {
  //   res.status(500).send();
  // }

  // User.find({}).then((users)=>{
  //   res.send(users)
  // }).catch((e)=>{
  //     res.status(500).send();
  // })
})


////became unneccessery after thr users/me...
// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send()
//     }
//     res.send(user)
//   } catch (error) {
//     res.status(500).send(error)
//   }

  // console.log(_id);
  // User.findById(_id).then((user)=>{
  //   console.log(user);
  //   if (!user){
  //     return res.status(404).send()
  //   }
  //   res.send(user)
  // }).catch((error) => {
  //   res.status(500).send(error)
  // })
// })

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];

  //approve that all updates are in allowed
  //every need all them to be true
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' })
  }
  try {
    //new returns after the update
    //const user = await User.findById(_id);
    updates.forEach((update)=>{
      req.user[update] = req.body[update];
    })
    await req.user.save();

    //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

    //no user with that id
    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
})


router.delete('/users/me',auth ,async (req,res) => {
    try {
      //no need after connecting
      //const user = await User.findByIdAndDelete(req.user._id)
      // if(!user){
      //   return res.status(404).send();
      // }
      await req.user.remove();
      sendcancelationEmail(req.user.email, req.user.name)
      res.send(req.user);
    } catch (error) {
      res.status(500).send();
    }
})

const upload = multer({
  //when removed it will not save the file, and we will be able to do with the file anything
  // dest: 'avatars',
  limits: {
    //1 mb
    fileSize: 1000000
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true);

  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) =>{
  const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer;
  await req.user.save();
  res.send()
}, 
(error, req, res, next)=>{
  res.status(400).send({error: error.message});
})


router.delete('/users/me/avatar', auth, async (req,res)=> {  
  //try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  // } catch (error) {
  //   res.status(400).send();
  // }
})





// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width">
//   <title>JS Bin</title>
// </head>
// <body>
//   <h1>test</h1>
//   <img src="http://localhost:3000/users/5eda52968d7fcc46c8532d62/avatar">
// </body>
// </html>
router.get('/users/:id/avatar/', async (req,res)=>{
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar){
      throw new Error();
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send();
  }
})

module.exports = router