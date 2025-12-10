import { MessageList } from "./features/websocket/components/MessageList";
import { WebsocketStatus } from "./features/websocket/components/WebsocketStatus";
import { MessageInput } from "./features/websocket/components/MessageInput";

export default function App() {
  const demoUrl = "ws://localhost:4000";

  return (
    <div className="container">
      <h1>RTK Query + WebSocket — demo</h1>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 12 }}
      >
        <div>
          <WebsocketStatus url={demoUrl} />
          <MessageList url={demoUrl} />
          <MessageInput url={demoUrl} />
        </div>

        <div>
          <div className="card">
            <h3>Как тестировать состояния</h3>
            <ol>
              <li>
                Запустите сервер и фронтенд — вы должны увидеть: подключение →
                приветствие → heartbeat-сообщения.
              </li>
              <li>
                Для проверки ошибки: измените `demoUrl` на `ws://localhost:9999`
                (сервера нет) и перезагрузите — будет показываться connecting →
                error/closed.
              </li>
              <li>
                Для проверки падения сервера: сервер закроет соединение через 15
                секунд для демонстрации — наблюдайте за состоянием closed и
                попытками переподключения.
              </li>
              <li>
                Используйте кнопку «Send message», чтобы отправлять сообщения
                всем подключенным клиентам.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
