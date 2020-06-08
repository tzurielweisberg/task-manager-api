const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'tzubielo@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`
  })
}


const sendcancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'tzubielo@gmail.com',
    subject: 'Sorry you have to leave!',
    text: `I am very sorry that you are leaving, ${name}. Let me know how we can help`
  })
}


module.exports = {
  sendWelcomeEmail,
  sendcancelationEmail
}