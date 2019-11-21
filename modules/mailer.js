const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const { email: { host, port, user, pass } } = require('../.env')

const transport = nodemailer.createTransport({
  host, 
  port,
  auth: { user, pass }
});

const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./resources/mail/auth/'),
    layoutsDir: path.resolve('./resources/mail/auth/'),
    defaultLayout: 'forgot_password.html',
  },
  viewPath: path.resolve('./resources/mail/auth/'),
  extName: '.html',
};

transport.use('compile', hbs(handlebarOptions));

module.exports = transport