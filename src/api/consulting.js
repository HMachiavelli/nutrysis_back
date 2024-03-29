module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.src.api.validation
    const { Consultating } = app.src.models.consultantingModel
    const { User } = app.src.models.userModel

    const insert = async (req, res) => {
        const consultating = new Consultating({ ...req.body })

        try {
            existsOrError(consultating.patientId, 'Paciente não informado')
            existsOrError(consultating.nutritionistId, 'Nutricionista não informado')
            existsOrError(consultating.date, 'Data não informada')

            await consultating.save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }

    }

    const update = async (req, res) => {
        try{
            const { patientId, nutritionistId, date, observation } = req.body

            const rowUpdated = await Consultating.findByIdAndUpdate(req.params.id, { $set: {
                patientId: patientId,
                nutritionistId: nutritionistId,
                date: date,
                observation: observation
            }}, { new: true, useFindAndModify: false })
                .catch(err => res.status(500). send(err))

            existsOrError(rowUpdated, "Consulta não foi encontrada")

            res.status(204).send()
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        Consultating.find()
            .then(consultatings => res.json(consultatings))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        if (app.db.Types.ObjectId.isValid(req.params.id)) {
            Consultating.findById(req.params.id)
                .then(consultating => res.json(consultating))
                .catch(err => res.status(500).send(err))
        } else {
            return res.status(500).send("Please provide correct Id")
        }
    }

    const remove = async (req, res) => {
        try {
            const consultating = await Consultating.findById(req.params.id)
                .catch(err => res.status(500).send(err))

            const patient = await User.findById(consultating.patientId);

            existsOrError(patient, "Consulta está vinculada a um paciente")

            const rowUpdated = await Consultating.findOneAndDelete({ _id: req.params.id })
                .catch(err => res.status(500). send(err))

            existsOrError(rowUpdated, "Consulta não foi encontrada")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getById, remove }
}
