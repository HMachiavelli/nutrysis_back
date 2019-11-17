module.exports = app => {
    // Setup schema
    const contactSchema = app.db.Schema({
        ddd: {
            type: Number,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        type: {
            type: String
        }
    });
    
    // Export Contact model
    const Contact = app.db.model('Contact', contactSchema);

    return { Contact }
}
