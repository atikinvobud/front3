const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8081 });
let clients = {};

wss.on("connection", (ws, req) => {
  const userID = new URL(req.url, `http://${req.headers.host}`).searchParams.get("userID");
  if (!userID) {
    ws.close();
    return;
  }
  
  clients[userID] = ws;
  console.log(`Пользователь ${userID} подключился к центральному WebSocket-серверу`);
  
  ws.send(JSON.stringify({ from: "server", text: "Вы подключены!" }));
  
  ws.on("message", (message) => {
    try {
      const { text } = JSON.parse(message);
      console.log(`Сообщение от ${userID}: ${text}`);
      
      Object.entries(clients).forEach(([id, client]) => {
        if (id !== userID && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ from: userID, text }));
        }
      });
    } catch (err) {
      console.error("Ошибка обработки сообщения:", err);
    }
  });
  
  ws.on("close", () => {
    console.log(`Пользователь ${userID} отключился`);
    delete clients[userID];
  });
});

console.log("Центральный WebSocket-сервер запущен на порту 8081");
