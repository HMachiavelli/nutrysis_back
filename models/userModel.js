module.exports = app => {
    // Setup schema
    const userSchema = app.mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        gender: String,
        phone: String,
        age: Number,
        cpf: String,
        password: {
            type: String,
            required: true
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
            defalut: null
        }
    });
    
    // Export Contact model
    const User = app.mongoose.model('User', userSchema);

    return { User}
}
