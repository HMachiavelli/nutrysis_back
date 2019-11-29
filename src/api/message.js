module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.src.api.validation
    const { Message } = app.src.models.messageModel

    const insert = async (data) => {
        const message = new Message({ ...data.body })

        try {
            existsOrError(message.userSend, 'Remetente não informado')
            existsOrError(message.userReceive, 'Destinatario não informado')
            existsOrError(message.message, 'Mensagem não informada')

            await message.save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const update = async (data) => {
        try{
            const { userSend, userReceive, message } = data.body

            if (app.db.Types.ObjectId.isValid(userSend) &&
                app.db.Types.ObjectId.isValid(userReceive) &&
                app.db.Types.ObjectId.isValid(req.params.id)) {
                const rowUpdated = await Message.findByIdAndUpdate(data.id, { '$set': {
                    message: message
                }}, { new: true, useFindAndModify: false })
                    .catch(err => res.status(500).send(err))

                existsOrError(rowUpdated, "Mensagem não foi encontrada")

                res.status(204).send()
            } else {
                return res.status(500).send("Please provide correct Id")
            }

        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (data) => {
        Message.find({ userSend: data.userSend, userReceive: data.userReceive })
            .then(message => res.json(message))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        if (app.db.Types.ObjectId.isValid(req.params.id)) {
            Message.findById(req.params.id)
                .then(message => res.json(message))
                .catch(err => res.status(500).send(err))
        } else {
            return res.status(500).send("Please provide correct Id")
        }
    }

    return { insert, update, get, getById }
}
