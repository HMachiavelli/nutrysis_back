module.exports = app => {
    // Setup schema
    const userSchema = app.db.Schema({
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
        type: {
            type: String, 
            enum: ['pacient', 'nutritionist']
        },
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
            default: null
        }
    });
    
    // Export Contact model
    const User = app.db.model('User', userSchema);

    return { User }
}
