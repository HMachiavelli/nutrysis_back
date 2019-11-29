module.exports = app => {
    const io = app.io.on('connection', socket => {
        console.log(`socket conectado: ${socket.id}`)

        socket.emit('previousMessages', app.src.api.message.get)

        socket.on('sendMessage', data => {
            console.log(data)

            app.src.api.message.insert
            socket.emit('receiveMessage', data)
        })
    })

    return io
}