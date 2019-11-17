const app = require('express')()
const consign = require('consign')
const db = require('./src/config/db')

app.db = db

consign()
    .then('./src/models')
    .include('./src/config/passport.js')
    .then('./src/config/middlewares.js')
    .then('./src/api/validation.js')
    .then('./modules')
    .then('./src/api')
    .then('./src/config/routes.js')
    .into(app)

app.listen(3000, () => {
    console.log('Backend executando...')
})