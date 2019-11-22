const mongoose = require('mongoose')
const { mongoURI } = require('../../.env')

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        const msg = "Conectado ao banco"
        console.log('\x1b[42m%s\x1b[37m', msg, '\x1b[0m')
    })
    .catch(e => {
        const msg = 'Não foi possível conectar com o MongoDB!'
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })

module.exports = mongoose
