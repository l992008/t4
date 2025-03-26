const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('Новое соединение установлено.');

  ws.on('message', (message) => {
    console.log(`Получено сообщение: ${message}`);

    // Отправка сообщения всем подключенным клиентам, кроме отправителя
    const messageObject = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageObject));
      }
    });
  });

  ws.on('close', () => {
    console.log('Соединение закрыто.');
  });
});

console.log('WebSocket сервер запущен на http://localhost:8081');