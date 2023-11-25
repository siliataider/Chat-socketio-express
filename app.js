const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`Hello j'ai démarré sur le port ${PORT}`))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname,'public')))

let socketsConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket){
    console.log(`Nouveau socket connecté: ${socket.id}`)
    socketsConnected.add(socket.id)

    io.emit('connected-total', socketsConnected.size)

    socket.on('disconnect', () => {
        console.log(`Socket déconnecté: ${socket.id}`)
        socketsConnected.delete(socket.id)
        io.emit('connected-total', socketsConnected.size)
    })

    socket.on('new-message', (data) => {
        console.log(`Nouveau message reçu: ${data.message} de la part de ${data.name}`)
        socket.broadcast.emit('refresh-chat', data)
    })

    socket.on('entrainDecrire', (data) => {
        console.log(`Quelqu'un est entrain d'écrire`)
        socket.broadcast.emit('refresh-entrain-decrire', data)
    })
}
