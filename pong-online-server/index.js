const WebSocket = require("ws");

const wss = new WebSocket.Server({
  port: 5000,
});

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    message = JSON.parse(message);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  });
  // ws.send("Подключение установлено");
});
