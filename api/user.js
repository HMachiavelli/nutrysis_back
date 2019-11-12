const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    const { User } = app.models.userModel

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    
    const insert = async (req, res) => {
        const user = new User({ ...req.body })

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false
        
        user.deletedAt = null
        user.type = 'pacient'

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(req.body.confPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, req.body.confPassword, 'Senhas não conferem')

            const userFromDB = await User.findOne({ email: user.email }, {}, {})

            notExistsOrError(userFromDB, 'Usuário já cadastrado')            
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)

        user.save()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }   

    const update = async (req, res) => {
        try{
            const { name, email, gender, phone, age, cpf, type, password } = req.body

            //const admin = false

            //if(!req.body.admin) admin = User.findById(req.params.id, 'admin')
            //if(!req.user || !req.user.admin) admin = false

            const rowUpdated = await User.findByIdAndUpdate(req.params.id, { $set: {
                name: name,
                email: email,
                gender: gender,
                phone: phone,
                age: age,
                cpf: cpf,
                type: type,
                password: encryptPassword(password)
            }}, { new: true, useFindAndModify: false })
                .catch(err => err.status(500). send(err))

            existsOrError(rowUpdated, "Usuário não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        User.find({ deleteAt: null })
            .then(users => res.json(users))
            .catch(err => err.status(500).send(err))
    }

    const getById = (req, res) => {
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            // const articles = await app.db('articles')
            //     .where({ userId: req.params.id })
            // notExistsOrError(articles, 'O usuário possui artigos')

            const rowUpdated = await User.findByIdAndUpdate(req.params.id, { $set: { 
                deleteAt: new Date()
            }}, { new: true, useFindAndModify: false })
                .catch(err => err.status(500). send(err))

            existsOrError(rowUpdated, "Usuário não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getById, remove }
}