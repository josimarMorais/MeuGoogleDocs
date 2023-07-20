const express  = require('express');
const socketIO = require('socket.io');
const path     = require('path');

// Inicializar o aplicativo Express
const app = express();
const server = app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});

// Configurar o Socket.IO com o servidor HTTP
const io = socketIO(server);


//Public
app.use(express.static(path.join(__dirname,"public")))


// Rota para servir a página inicial
app.get('/', (req, res) => {
  res.render('index');
});


// Lista de sockets conectados
let connectedSockets = [];


// Texto atual
let currentText = '';


// Lidar com a conexão de um novo socket
io.on('connection', (socket) => {

console.log(socket.id)

  // Adicionar o socket à lista de sockets conectados
  connectedSockets.push(socket);


  // Enviar o texto atual para o novo socket
  socket.emit('text', currentText);


  // Lidar com a edição do texto por um socket
  socket.on('edit', (dados) => {

    console.log("Posição: ", dados.ponto)
    console.log("valor: ", dados.text)

    // Atualizar o texto atual
    currentText = dados.text;

    // Enviar o novo texto para todos os sockets conectados, exceto o socket atual
    socket.broadcast.emit('text', currentText);
  });


  // Lidar com a desconexão de um socket
  socket.on('disconnect', () => {
    // Remover o socket da lista de sockets conectados
    connectedSockets = connectedSockets.filter((s) => s !== socket);
  });
});