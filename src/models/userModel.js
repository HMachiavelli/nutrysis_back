const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    // Setup schema
    const userSchema = app.db.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },
        gender: String,
        phone: String,
        age: Number,
        cpf: String,
        type: {
            type: String, 
            enum: ['pacient', 'nutritionist']
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        passwordResetToken: {
            type: String,
            select: false
        },
        passwordResetExpires: {
            type: Date,
            select: false
        },
        admin: {
            type: Boolean,
            required: true
        },
        createAt: {
            type: Date,
            default: Date.now
        },
        deleteAt: {
            type: Date,
            default: null
        }
    });

    userSchema.pre('save', async function(next) {
        this.password = encryptPassword(this.password)

        next();
    })

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    
    // Export Contact model
    const User = app.db.model('User', userSchema);

    return { User }
}
