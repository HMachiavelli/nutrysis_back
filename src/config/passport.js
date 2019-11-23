const { authSecret } = require('../../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const { User } = app.src.models.userModel

    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        try{
            if (app.db.Types.ObjectId.isValid(payload._id)) {
                User.findById(payload._id)
                    .then(user => done(null, user ? { ...payload } : false))
                    .catch(err => done(err, false))
            } else {

            }
        } catch(msg) {
            
        }
    })

    passport.use(strategy)

    return { authenticate: () => passport.authenticate('jwt', { session: false }) }
}