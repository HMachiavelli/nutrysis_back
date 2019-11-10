module.exports = app => {
    // Setup schema
    const diseaseSchema = app.db.Schema({
        name: {
            type: String,
            required: true
        },
        dateDiscovery: {
            type: Date
        },
        observation: {
            type: String
        }
    });
    
    // Export Contact model
    const Disease = app.db.model('Disease', diseaseSchema);

    return { Disease }
}
