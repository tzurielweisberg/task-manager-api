const mongoose = require('mongoose');
//const validator = require('validator');


mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify:false
})





// const me = new User({
//   name: '  Tzur  ',
//   email: 'MyEmail@gmail.coM   ',
//   password: '1234567'

// })

// me.save().then(() => {
//   console.log(me);
// }).catch((error) => {
//   console.log('Error', error);
// })
// const shop = new Task({
//   description: '  Go shopping',
// })
// shop.save().then(() => {
//   console.log(shop);
  
// }).catch((error) => {
//   console.log(error);
  
//  })
//qeqeQE13
// const me = new User({
//   name: 'Tzuriel',
//   age: 29
// })

// me.save().then(() => {
//   console.log(me);
  
// }).catch((error) => {
//   console.log('Error', error);
  
// });