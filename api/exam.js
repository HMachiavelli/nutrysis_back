module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    const { Exam } = app.models.examModel
    const { User } = app.models.userModel
    
    const insert = async (req, res) => {
        const exam = new Exam({ ...req.body })

        try {
            existsOrError(exam.patientId, 'Paciente não informado')
            existsOrError(exam.name, 'Nome não informado')       
        } catch(msg) {
            return res.status(400).send(msg)
        }

        exam.save()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }   

    const update = async (req, res) => {
        try{
            const { name, priority, date, type } = req.body

            const rowUpdated = await Exam.findByIdAndUpdate(req.params.id, { $set: {
                name: name,
                priority: priority,
                date: date,
                type: type
            }}, { new: true, useFindAndModify: false })
                .catch(err => err.status(500). send(err))

            existsOrError(rowUpdated, "Exame não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        Exam.find()
            .then(exams => res.json(exams))
            .catch(err => err.status(500).send(err))
    }

    const getById = (req, res) => {
        Exam.findById(req.params.id)
            .then(exam => res.json(exam))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const exam = await Exam.findById(req.params.id)     
                .catch(err => res.status(500).send(err))

            const patients = await User.findById(exam.patientId)
                .catch(err => res.status(500).send(err))
            notExistsOrError(patients, 'Exame vinculado a um paciente')

            const rowUpdated = await Exam.findOneAndDelete({ _id: req.params.id })
                .catch(err => err.status(500). send(err))

            existsOrError(rowUpdated, "Exame não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getById, remove }
}