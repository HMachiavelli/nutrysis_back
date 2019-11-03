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

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(req.body.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, req.body.confirmPassword, 'Senhas não conferem')

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
        const user = new User({ ...req.body })
        user._id = req.params.id
        
        if(!req.body.admin) user.admin = User.findById(user._id, 'admin')
        //if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(req.body.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, req.body.confirmPassword, 'Senhas não conferem')         
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)

        const userUpdate = await User.findByIdAndUpdate(user._id, user, { new: true, useFindAndModify: false})

        await userUpdate.save()
            .then(_ => res.status(204).send({userUpdate}))
            .catch(err => res.status(500).send(err))
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

            const rowUpdated = await User.update({ _id: req.params.id }, { deleteAt: new Date() }, {})
                .catch(err => err.status(500). send(err))

            existsOrError(rowUpdated, "Usuário não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getById, remove }
}