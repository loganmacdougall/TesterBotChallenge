const socket = io();

const form = document.getElementsByTagName('form')[0];
const input = document.getElementById('chatbox');
const messages = document.getElementById('messages');
const testButton = document.getElementById('run-bot-button')

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat-send', input.value);
    input.value = '';
  }
});

socket.on('chat-recv', (msg) => {
  createMessage(msg)
})

socket.on('user-connect', (id) => {
  const msg = `<span style='color: gray'>${id}: connected</span>`
  createMessage(msg)
})

socket.on('bot-running', () => {
  testButton.disabled = true
})

socket.on('bot-not-running', () => {
  testButton.disabled = false
})

function createMessage(msg) {
  let messageElement = document.createElement('div')
  messageElement.classList.add('message')
  messageElement.innerHTML = msg
  
  let scrollAtBottom = messages.scrollHeight - messages.clientHeight == messages.scrollTop

  messages.appendChild(messageElement)

  if (scrollAtBottom) {
    messages.scrollTo(0, messages.scrollHeight - messages.clientHeight);
  }
}

async function runBot() {
  socket.emit('run-test-bot');
}