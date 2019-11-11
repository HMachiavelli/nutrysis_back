module.exports = app => {
    // Setup schema
    const consultantingSchema = app.db.Schema({
        patientId: {
            type: String,
            required: true,
        },
        nutritionistId: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        observation: {
            type: String
        }
    });
    
    // Export Contact model
    const Consultating = app.db.model('Consultating', consultantingSchema);

    return { Consultating }
}
