module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.src.api.validation
    const { Disease } = app.src.models.diseaseModel
    
    const insert = async (req, res) => {
        const disease = new Disease({ ...req.body })

        try {
            existsOrError(disease.name, 'Nome não informado')       
            
            await disease.save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }   

    const update = async (req, res) => {
        try{
            const { name, dateDiscovery, observation } = req.body

            const rowUpdated = await Disease.findByIdAndUpdate(req.params.id, { $set: {
                name: name,
                dateDiscovery: dateDiscovery,
                observation: observation
            }}, { new: true, useFindAndModify: false })
                .catch(err => res.status(500). send(err))

            existsOrError(rowUpdated, "Doença não foi encontrada")

            res.status(204).send()
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        Disease.find()
            .then(diseases => res.json(diseases))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        if (app.db.Types.ObjectId.isValid(req.params.id)) {         
            Disease.findById(req.params.id)
                .then(disease => res.json(disease))
                .catch(err => res.status(500).send(err))
        } else {
            return res.status(500).send("Please provide correct Id")
        }
    }

    const remove = async (req, res) => {
        try {
            const rowUpdated = await Disease.findOneAndDelete({ _id: req.params.id })
                .catch(err => res.status(500). send(err))

            existsOrError(rowUpdated, "Doença não foi encontrada")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getById, remove }
}