const { authSecret } = require('../../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.src.api.validation
    const { User } = app.src.models.userModel

    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha')
        }

        const user = await User.findOne({ email: req.body.email })
            .select('+ password')

        if(!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = await bcrypt.compareSync(req.body.password, user.password)
        if(!isMatch) return res.status(401).send('Email/senha inválidos')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payload, 
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null

        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token 
        }

        res.send(false)
    }

    const forgotPassword = async (req, res) => {
        const { email } = req.body

        try {
            const user = await User.findOne({ email })

            existsOrError(user, 'Usuário não cadastrado')

            const token = crypto.randomBytes(20).toString('hex')
                
            const now = new Date()
            now.setHours(now.getHours() + 1)
                
            if (app.db.Types.ObjectId.isValid(user._id)){         
                await User.findByIdAndUpdate(user._id, { '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }}, { new: true, useFindAndModify: false })
                    .catch(err => res.status(400). send(err))

                await app.modules.mailer.sendMail({
                    from: 'hsmachiavelli@gmail.com',
                    to: email,
                    subject: 'Recuperar sua senha',
                    template: 'forgot_password',
                    context: { token, email }
                }, (err) => {
                    if (err) return res.status(400).send(err)

                    return res.status(204).send()
                })
            } else {
                return res.status(400).send("Please provide correct Id")
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const resetPassword = async (req, res) => {
        const { email, token, password } = req.body

        try {
            const user = await User.findOne({ email }) 
                .select('+ passwordResetToken passwordResetExpires')

            existsOrError(user, 'Usuário não cadastrado')

            if (token !== user.passwordResetToken)
                return res.status(400).send('Token invalido')

            const now = new Date()

            if (now > user.passwordResetExpires)
                return res.status(400).send('Token expirado, gere um novo')

            user.password = password

            await user.save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

        } catch (msg) {
            return res.status(500).send(msg)
        }
    }

    return { signin, validateToken, forgotPassword, resetPassword }
}