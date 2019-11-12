const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
var cors = require('cors');

app.db = db

app.use(cors());

consign()
    .then('./models')
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(3001, () => {
    console.log('Backend executando...')
})