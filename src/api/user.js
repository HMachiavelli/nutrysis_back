module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.src.api.validation
    const { User } = app.src.models.userModel

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

            const userFromDB = await User.findOne({ email: user.email })

            notExistsOrError(userFromDB, 'Usuário já cadastrado')

            await user.save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const update = async (req, res) => {
        try{
            const { name, email, gender, phone, age, cpf } = req.body

            //const admin = false

            //if(!req.body.admin) admin = User.findById(req.params.id, 'admin')
            //if(!req.user || !req.user.admin) admin = false

            if (app.db.Types.ObjectId.isValid(req.params.id)) {
                const rowUpdated = await User.findByIdAndUpdate(req.params.id, { '$set': {
                    name: name,
                    email: email,
                    gender: gender,
                    phone: phone,
                    age: age,
                    cpf: cpf
                }}, { new: true, useFindAndModify: false })
                    .catch(err => res.status(500).send(err))

                existsOrError(rowUpdated, "Usuário não foi encontrado")

                res.status(204).send()
            } else {
                return res.status(500).send("Please provide correct Id")
            }

        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        User.find({ deleteAt: null })
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getPacients = (req, res) => {
        User.find({ deleteAt: null, type: "pacient" })
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        if (app.db.Types.ObjectId.isValid(req.params.id)) {
            User.findById(req.params.id)
                .then(user => res.json(user))
                .catch(err => res.status(500).send(err))
        } else {
            return res.status(500).send("Please provide correct Id")
        }
    }

    const remove = async (req, res) => {
        try {
            // const articles = await app.db('articles')
            //     .where({ userId: req.params.id })
            // notExistsOrError(articles, 'O usuário possui artigos')

            if (app.db.Types.ObjectId.isValid(req.params.id)) {
                const rowUpdated = await User.findByIdAndUpdate(req.params.id, { $set: {
                    deleteAt: new Date()
                }}, { new: true, useFindAndModify: false })
                    .catch(err => res.status(500).send(err))

                existsOrError(rowUpdated, "Usuário não foi encontrado")

                res.status(204).send()
            } else {
                return res.status(500).send("Please provide correct Id")
            }
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getPacients, getById, remove }
}