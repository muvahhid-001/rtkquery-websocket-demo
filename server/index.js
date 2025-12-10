const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 4000 });

console.log("WebSocket сервер слушает ws://localhost:4000");

let clientId = 0;

function broadcast(data) {
  const raw = JSON.stringify(data);
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) c.send(raw);
  });
}

wss.on("connection", (ws) => {
  const id = ++clientId;
  console.log("Клиент подключился", id);

  ws.send(
    JSON.stringify({
      type: "welcome",
      payload: { message: `Добро пожаловать, клиент #${id}`, time: Date.now() },
    })
  );

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({ type: "heartbeat", payload: { time: Date.now() } })
      );
    }
  }, 5000);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data?.type === "chat") {
        broadcast({
          type: "chat",
          payload: {
            username: data.payload.username || `Гость #${id}`,
            message: data.payload.text || "",
            time: Date.now(),
          },
        });
      }
    } catch (err) {
      console.log("Некорректное сообщение", err);
    }
  });

  ws.on("close", () => {
    console.log("Клиент отключился", id);
    clearInterval(interval);
  });
});
