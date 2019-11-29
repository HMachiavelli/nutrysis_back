module.exports = app => {
    // Setup schema
    const messageSchema = app.db.Schema({
        userSend: {
            type: String,
            required: true
        },
        userReceive: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    });
    
    // Export Contact model
    const Message = app.db.model('Message', messageSchema);

    return { Message }
}
