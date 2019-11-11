module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    const { Disease } = app.models.diseaseModel
    
    const insert = async (req, res) => {
        const disease = new Disease({ ...req.body })

        try {
            existsOrError(disease.name, 'Nome não informado')       
        } catch(msg) {
            return res.status(400).send(msg)
        }

        disease.save()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }   

    const update = async (req, res) => {
        try{
            const { name, dateDiscovery, observation } = req.body

            const rowUpdated = await Disease.findByIdAndUpdate(req.params.id, { $set: {
                name: name,
                dateDiscovery: dateDiscovery,
                observation: observation
            }}, { new: true, useFindAndModify: false })
                .catch(err => err.status(500). send(err))

            existsOrError(rowUpdated, "Doença não foi encontrada")

            res.status(204).send()
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        Disease.find()
            .then(diseases => res.json(diseases))
            .catch(err => err.status(500).send(err))
    }

    const getById = (req, res) => {
        Disease.findById(req.params.id)
            .then(disease => res.json(disease))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const rowUpdated = await Disease.findOneAndDelete({ _id: req.params.id })
                .catch(err => err.status(500). send(err))

            existsOrError(rowUpdated, "Doença não foi encontrada")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getById, remove }
}