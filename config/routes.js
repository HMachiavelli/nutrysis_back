//const admin = require('./admin')

module.exports = app => {
    //app.post('/signup', app.api.user.save)
    //app.post('/signin', app.api.auth.signin)
    //app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        // .all(app.config.passport.authenticate())
        .get(app.api.user.get)
        .post(app.api.user.insert)

    app.route('/users/:id')
        // .all(app.config.passport.authenticate())
        // .get(admin(app.api.user.getById))
        .get(app.api.user.getById)
        // .put(admin(app.api.user.save))
        .put(app.api.user.update)
        // .delete(admin(app.api.user.remove))
        .delete(app.api.user.remove)
}