module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.src.api.validation
    const { Contact } = app.src.models.contactModel
    
    const insert = async (req, res) => {
        const contact = new Contact({ ...req.body })

        try {
            existsOrError(contact.ddd, 'DDD não informado')  
            existsOrError(contact.number, 'Numero não informado')       

            await contact.save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }   

    const update = async (req, res) => {
        try{
            const { ddd, number, type } = req.body

            const rowUpdated = await Contact.findByIdAndUpdate(req.params.id, { $set: {
                ddd: ddd,
                number: number,
                type: type
            }}, { new: true, useFindAndModify: false })
                .catch(err => res.status(500). send(err))

            existsOrError(rowUpdated, "Contato não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        Contact.find()
            .then(contacts => res.json(contacts))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        if (app.db.Types.ObjectId.isValid(req.params.id)) {         
            Contact.findById(req.params.id)
                .then(contact => res.json(contact))
                .catch(err => res.status(500).send(err))
        } else {
            return res.status(400).send("Please provide correct Id")
        }
    }

    const remove = async (req, res) => {
        try {
            const rowUpdated = await Contact.findOneAndDelete({ _id: req.params.id })
                .catch(err => res.status(500). send(err))

            existsOrError(rowUpdated, "Contato não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getById, remove }
}