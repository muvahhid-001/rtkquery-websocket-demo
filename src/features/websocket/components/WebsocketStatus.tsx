import { useSubscribeQuery } from "../websocketApi";
import styles from "./WebsocketStatus.module.scss";

export const WebsocketStatus: React.FC<{ url?: string }> = ({ url }) => {
  const { data, isFetching } = useSubscribeQuery(
    url ? { url } : (undefined as any)
  );
  const state =
    (data as any)?.type || (isFetching ? "Подключение..." : "Неизвестно");

  const formatData = () => {
    if (!data) return "Нет сообщений";

    const time = new Date(
      data.payload?.time || Date.now()
    ).toLocaleTimeString();

    switch (data.type) {
      case "welcome":
        return `🔌 ${data.payload.message} (${time})`;
      case "heartbeat":
        return `❤️ Пульс сервера (${time})`;
      case "chat":
        return `💬 ${data.payload.username}: ${data.payload.message} (${time})`;
      default:
        return `❌ Ошибка сервера или соединение закрыто (${time})`;
    }
  };

  return (
    <div className={styles.card}>
      <h3>Статус подключения</h3>
      <div className={styles.status}>
        <div>
          <strong>{state}</strong>
        </div>
        <div>{formatData()}</div>
      </div>
    </div>
  );
};
