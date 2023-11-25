const socket = io()

const clientsTotal = document.getElementById('connected-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

socket.on('connected-total', (data) => {
    console.log(`Client: il y a ${data} participants dans le chat`)
    clientsTotal.innerText = `Participants: ${data}`
})

messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    sendMessage()
})

function sendMessage(){
    if (messageInput.value == '') return
    console.log(`Nouveau message envoyé: ${messageInput.value}`)
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        timestamp: new Date().toLocaleString()
    }
    socket.emit('new-message', data)
    printMessage(true, data)
    scrollDown()
    messageInput.value = ''
}

socket.on('refresh-chat', (data) => {
    console.log(`Nouveau message reçu: ${data.message} de la part de ${data.name}`)
    printMessage(false, data)
    scrollDown()
})

function printMessage(isSent, data){
    clearEntrainDecrire()
    const element = `
        <li class=${isSent ? "message-right" : "message-left"}>
            <p class="message">
                ${data.message}
                <span>${data.name} 🕒 ${data.timestamp}</span>
            </p>
        </li>
        `
    messageContainer.innerHTML += element
}

function scrollDown(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('entrainDecrire', {
        qlqEntrainDecrire: `${nameInput.value} est entrain d'ecrire ... 💬`
    })
})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('entrainDecrire', {
        qlqEntrainDecrire: `${nameInput.value} est entrain d'ecrire ... 💬`
    })
})

messageInput.addEventListener('blurr', (e) => {
    socket.emit('entrainDecrire', {
        qlqEntrainDecrire: ``,
    })
})

socket.on('refresh-entrain-decrire', (data) => {
    clearEntrainDecrire()
    const element = `
        <li class="message-live">
            <p class="live" id="live">
                ${data.qlqEntrainDecrire}
            </p>
        </li>
        `
    messageContainer.innerHTML += element
    scrollDown()
})

function clearEntrainDecrire() {
    document.querySelectorAll('li.message-live').forEach(element => {
        element.parentNode.removeChild(element)
    })
}