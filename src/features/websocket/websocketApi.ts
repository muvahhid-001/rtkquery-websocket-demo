import { createApi } from "@reduxjs/toolkit/query/react";
import type { WSMessage } from "../../types";

export const websocketApi = createApi({
  reducerPath: "websocketApi",
  baseQuery: async () => ({ data: {} }),
  endpoints: (build) => ({
    subscribe: build.query<WSMessage, { url: string } | void>({
      query: () => ({} as any),
      async onCacheEntryAdded(arg, { updateCachedData, cacheEntryRemoved }) {
        const url = (arg && (arg as any).url) || "ws://localhost:4000";

        let socket: WebSocket | null = null;
        let reconnectAttempt = 0;
        let manualClose = false;

        const connect = () => {
          reconnectAttempt++;

          try {
            socket = new WebSocket(url);
          } catch (err) {
            updateCachedData((draft) => {
              Object.assign(draft, {
                type: "error",
                payload: { message: String(err) },
              });
            });
            return;
          }

          updateCachedData((draft) => {
            Object.assign(draft, {
              type: "connecting",
              payload: { attempt: reconnectAttempt, time: Date.now() },
            });
          });

          socket.addEventListener("open", () => {
            reconnectAttempt = 0;
            updateCachedData((draft) => {
              Object.assign(draft, {
                type: "welcome",
                payload: { message: "Сервер подключен", time: Date.now() },
              });
            });
          });

          socket.addEventListener("message", (ev) => {
            try {
              const data = JSON.parse(ev.data);
              updateCachedData((draft) => {
                Object.assign(draft, data);
              });
            } catch {
              updateCachedData((draft) => {
                Object.assign(draft, {
                  type: "error",
                  payload: { message: "Ошибка парсинга сообщения" },
                });
              });
            }
          });

          socket.addEventListener("close", (evt) => {
            updateCachedData((draft) => {
              Object.assign(draft, {
                type: "closed",
                payload: { code: evt.code, reason: evt.reason },
              });
            });

            socket = null;

            if (!manualClose) {
              const timeout = Math.min(
                30000,
                1000 * Math.pow(2, reconnectAttempt)
              );
              setTimeout(() => connect(), timeout);
            }
          });

          socket.addEventListener("error", () => {
            updateCachedData((draft) => {
              Object.assign(draft, {
                type: "error",
                payload: { message: "Ошибка сокета" },
              });
            });
          });
        };

        connect();

        const controller = {
          send: (d: any) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify(d));
            }
          },
          close: () => {
            manualClose = true;
            if (socket) socket.close(1000, "client-closed");
          },
        };

        await cacheEntryRemoved;
        controller.close();
      },
    }),
  }),
});

export const { useSubscribeQuery } = websocketApi;
