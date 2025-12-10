import { useEffect, useState } from "react";
import { useSubscribeQuery } from "../websocketApi";
import type { WSMessage } from "../../../types";
import styles from "./MessageList.module.scss";

export const MessageList: React.FC<{ url?: string }> = ({ url }) => {
  const { data } = useSubscribeQuery(url ? { url } : (undefined as any));
  const [messages, setMessages] = useState<WSMessage[]>([]);

  useEffect(() => {
    if (!data) return;

    if (
      (data.type === "chat" &&
        "message" in data.payload &&
        "username" in data.payload) ||
      (data.type === "welcome" && "message" in data.payload) ||
      data.type === "heartbeat"
    ) {
      setMessages((m) => [...m, data as WSMessage]);
    }
  }, [data]);

  const formatMessage = (msg: WSMessage) => {
    const time = new Date(msg.payload?.time || Date.now()).toLocaleTimeString();

    switch (msg.type) {
      case "welcome":
        return `🔌 ${msg.payload.message} (${time})`;
      case "heartbeat":
        return `❤️ Пульс сервера (${time})`;
      case "chat":
        return `💬 ${msg.payload.username}: ${msg.payload.message} (${time})`;
      default:
        return `❌ Ошибка сервера или соединение закрыто (${time})`;
    }
  };

  return (
    <div className={styles.card}>
      <h3>Общий чат</h3>
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.empty}>Сообщений пока нет</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={styles.message}>
            {formatMessage(msg)}
          </div>
        ))}
      </div>
    </div>
  );
};
