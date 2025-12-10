import { useEffect, useState } from "react";
import { useSubscribeQuery } from "../websocketApi";
import type { WSMessage } from "../../../types";
import styles from "./MessageList.module.scss";

export const MessageList: React.FC<{ url?: string }> = ({ url }) => {
  const { data } = useSubscribeQuery(url ? { url } : (undefined as any));
  const [messages, setMessages] = useState<WSMessage[]>([]);

  useEffect(() => {
    if (!data) return;

    // теперь учитываем все типы сообщений, включая connecting, closed, error
    if (
      (data.type === "chat" &&
        "message" in data.payload &&
        "username" in data.payload) ||
      (data.type === "welcome" && "message" in data.payload) ||
      data.type === "heartbeat" ||
      data.type === "connecting" ||
      data.type === "closed" ||
      data.type === "error"
    ) {
      setMessages((m) => [...m, data as WSMessage]);
    }
  }, [data]);

  const formatMessage = (msg: WSMessage) => {
    const time = new Date(msg.payload?.time || Date.now()).toLocaleTimeString();

    switch (msg.type) {
      case "connecting":
        return `🔄 Подключение… Попытка №${
          msg.payload?.attempt || 1
        } (${time})`;
      case "welcome":
        return `🔌 ${msg.payload.message} (${time})`;
      case "heartbeat":
        return `❤️ Пульс сервера (${time})`;
      case "chat":
        return `💬 ${msg.payload.username}: ${msg.payload.message} (${time})`;
      case "closed":
        return `❌ Соединение закрыто (код: ${msg.payload?.code}, причина: ${msg.payload?.reason}) (${time})`;
      case "error":
        return `❌ Ошибка: ${msg.payload?.message} (${time})`;
      default:
        return `❌ Неизвестное сообщение (${time})`;
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
