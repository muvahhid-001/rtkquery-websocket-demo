import { useSubscribeQuery } from "../websocketApi";
import styles from "./WebsocketStatus.module.scss";

export const WebsocketStatus: React.FC<{ url?: string }> = ({ url }) => {
  const { data } = useSubscribeQuery(url ? { url } : (undefined as any));

  let statusText = "";
  let messageText = "";

  if (!data) {
    statusText = "Подключение…";
    messageText = "";
  } else {
    switch (data.type) {
      case "connecting":
        statusText = "Подключение…";
        messageText = `Попытка №${data.payload?.attempt || 1}`;
        break;
      case "welcome":
        statusText = "Подключено";
        messageText = `🔌 ${data.payload?.message} (${new Date(
          data.payload?.time
        ).toLocaleTimeString()})`;
        break;
      case "heartbeat":
        statusText = "Подключено";
        messageText = `❤️ Пульс сервера (${new Date(
          data.payload?.time
        ).toLocaleTimeString()})`;
        break;
      case "chat":
        statusText = "Подключено";
        messageText = `💬 ${data.payload?.username}: ${data.payload?.message}`;
        break;
      case "closed":
        statusText = "❌ Соединение закрыто";
        messageText = `Код: ${data.payload?.code}, причина: ${data.payload?.reason}`;
        break;
      case "error":
        statusText = "❌ Ошибка сервера";
        messageText = data.payload?.message;
        break;
      default:
        statusText = "Неизвестно";
        messageText = "";
    }
  }

  return (
    <div className={styles.card}>
      <h3>Статус подключения</h3>
      <div className={styles.status}>
        <div>
          <strong>{statusText}</strong>
        </div>
        <div>{messageText}</div>
      </div>
    </div>
  );
};
