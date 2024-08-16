import { createServer } from 'node:http';
import express from 'express'
import {try_bot_launch, is_bot_running} from './bot.js'
import { Server as ioServer } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new ioServer(server)

const port = 3000

app.set('view engine', 'ejs');
app.set('trust proxy', 1)
app.set('views', './views')
app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  let showRealFlag = false
  let key = req?.query?.key ?? undefined
  if (key) {
    showRealFlag = key == process.env.KEY
  }
  res.render("index.ejs", {showRealFlag: showRealFlag})
})

io.on('connection', (socket) => {
  socket.on('chat-send', (msg) => {
    socket.emit('chat-recv', `<span style='color:white'>${msg}</span>`)
    socket.broadcast.emit('chat-recv', `<span style='color:#ff9999'>${msg}</span>`)
  })

  socket.on('run-test-bot', () => {
    const onRunning = () => { 
      socket.emit('bot-running')
      socket.broadcast.emit('bot-running')
    }
    const onNotRunning = () => {
      socket.emit('bot-not-running')
      socket.broadcast.emit('bot-not-running')
    }
    try_bot_launch(onRunning, onNotRunning)
  })

  socket.broadcast.emit('user-connect', socket.id)

  socket.emit(is_bot_running() ? 'bot-running' : 'bot-not-running')
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})