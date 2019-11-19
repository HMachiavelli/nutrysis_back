module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.src.api.validation
    const { Exam } = app.src.models.examModel
    const { User } = app.src.models.userModel
    
    const insert = async (req, res) => {
        const exam = new Exam({ ...req.body })

        try {
            existsOrError(exam.patientId, 'Paciente não informado')
            existsOrError(exam.name, 'Nome não informado')       
            
            await exam.save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }
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
                .catch(err => res.status(500). send(err))

            existsOrError(rowUpdated, "Exame não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        Exam.find()
            .then(exams => res.json(exams))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        if (app.db.Types.ObjectId.isValid(req.params.id)) {
            Exam.findById(req.params.id)
                .then(exam => res.json(exam))
                .catch(err => res.status(500).send(err))

        } else {
            return res.status(500).send("Please provide correct Id")
        }
    }

    const remove = async (req, res) => {
        try {
            const exam = await Exam.findById(req.params.id)     
                .catch(err => res.status(500).send(err))

            const patients = await User.findById(exam.patientId)
                .catch(err => res.status(500).send(err))
            notExistsOrError(patients, 'Exame vinculado a um paciente')

            const rowUpdated = await Exam.findOneAndDelete({ _id: req.params.id })
                .catch(err => res.status(500). send(err))

            existsOrError(rowUpdated, "Exame não foi encontrado")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { insert, update, get, getById, remove }
}