const express = require('express')
const bodyParser = require('body-parser')
const {engine} = require('express-handlebars')
const session = require('express-session');

// const exphbs = require('express-handlebars')
// const path = require('path')
const nodemailer = require('nodemailer')
const flash = require('connect-flash')


const app = express()

// view engine setup 

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// app.engine('handlebars', exphbs())
// app.set('view engine', 'handlebars')
app.use(express.static('public'));

// app.use('/public',express.static(path.join(__dirname, 'public')))
app.set('views', './views');

// setup session 
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// using flash for messages
app.use(flash());

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



app.post('/send',(req,res)=>{
    // console.log(req.body);
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: 'example@gmail.com',
          pass: 'app password in gmail'
        }
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const message = `
                    name: ${req.body.username}
                    email: ${req.body.email}
                    cellphone: ${req.body.cellphone}
                    message: ${req.body.message}
                    `;
        const info = await transporter.sendMail({
          from: '"example 👻" <example@gmail.com>', // sender address
          to: "expample@gmail.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: message, // html body
        });
      msg = 'Message Sent Successfully !';
      req.flash('success', msg); 
             // console.log("Message sent: %s", info.messageId);
             const formData = req.body; // Access the entire form data
             req.flash('formData', formData);

        res.redirect('/contact')

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        //
        // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //       <https://github.com/forwardemail/preview-email>
        //
      }
      
      main().catch(()=>{
        msg = 'Faild ! try again later';
        req.flash('error', msg);
        const formData = req.body; // Access the entire form data
             req.flash('formData', formData);
        res.redirect('/contact')
      });

})

app.get('/contact',(req,res)=>{
  const formData = req.flash('formData')[0]; // Retrieve the flash data

    res.render('contact', { formData,successMessage: req.flash('success'), errorMessage: req.flash('error') })
})

app.listen(5000,()=>{
    console.log(`Server running on port 5000`);
})