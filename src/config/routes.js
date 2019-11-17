//const admin = require('./admin')

module.exports = app => {
    app.post('/signup', app.src.api.user.insert)
    app.post('/signin', app.src.api.auth.signin)
    app.post('/validateToken', app.src.api.auth.validateToken)

    app.route('/forgot_password')
        .post(app.src.api.auth.forgotPassword)
    
    app.route('/reset_password/:token')
        .post(app.src.api.auth.resetPassword)

    app.route('/users')
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.user.get)
        .post(app.src.api.user.insert)

    app.route('/users/:id')
        .all(app.src.config.passport.authenticate())
        // .get(admin(app.src.api.user.getById))
        .get(app.src.api.user.getById)
        // .put(admin(app.src.api.user.save))
        .put(app.src.api.user.update)
        // .delete(admin(app.src.api.user.remove))
        .delete(app.src.api.user.remove)

    app.route('/exams')
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.exam.get)
        .post(app.src.api.exam.insert)

    app.route('/exams/:id')
        .all(app.src.config.passport.authenticate())
        // .get(admin(app.src.api.exam.getById))
        .get(app.src.api.exam.getById)
        // .put(admin(app.src.api.exam.save))
        .put(app.src.api.exam.update)
        // .delete(admin(app.src.api.exam.remove))
        .delete(app.src.api.exam.remove)

    app.route('/diseases')
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.disease.get)
        .post(app.src.api.disease.insert)

    app.route('/diseases/:id')
        .all(app.src.config.passport.authenticate())
        // .get(admin(app.src.api.disease.getById))
        .get(app.src.api.disease.getById)
        // .put(admin(app.src.api.disease.save))
        .put(app.src.api.disease.update)
        // .delete(admin(app.src.api.disease.remove))
        .delete(app.src.api.disease.remove)
    
    app.route('/consultings')
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.consulting.get)
        .post(app.src.api.consulting.insert)

    app.route('/consultings/:id')
        .all(app.src.config.passport.authenticate())
        // .get(admin(app.src.api.consulting.getById))
        .get(app.src.api.consulting.getById)
        // .put(admin(app.src.api.consulting.save))
        .put(app.src.api.consulting.update)
        // .delete(admin(app.src.api.consulting.remove))
        .delete(app.src.api.consulting.remove)
}