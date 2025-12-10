import { useRef, useState } from "react";

export const MessageInput: React.FC<{ url?: string }> = ({ url }) => {
  const [text, setText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const ensureWs = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      wsRef.current = new WebSocket(url || "ws://localhost:4000");
    }
  };

  const send = () => {
    ensureWs();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "chat", payload: { username: "Вы", text } })
      );
      setText("");
    }
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h3>Отправка сообщений</h3>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ marginTop: 8 }}>
        <button onClick={send} disabled={!text.trim()}>
          Отправить
        </button>
      </div>
    </div>
  );
};
