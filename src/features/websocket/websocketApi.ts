import { createApi } from "@reduxjs/toolkit/query/react";
import type { WSMessage } from "../../types";

export const websocketApi = createApi({
  reducerPath: "websocketApi",
  baseQuery: async () => ({ data: {} }),
  endpoints: (build) => ({
    subscribe: build.query<WSMessage, { url: string } | void>({
      query: () => ({} as any),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        const url = (arg && (arg as any).url) || "ws://localhost:4000";

        let socket: WebSocket | null = null;
        let reconnectAttempt = 0;
        let manualClose = false;

        const connect = () => {
          reconnectAttempt++;
          try {
            socket = new WebSocket(url);
          } catch (err) {
            updateCachedData(
              () =>
                ({ type: "error", payload: { message: String(err) } } as any)
            );
            return;
          }

          updateCachedData(
            () =>
              ({
                type: "connecting",
                payload: { attempt: reconnectAttempt },
              } as any)
          );

          socket.addEventListener("open", () => {
            reconnectAttempt = 0;
            updateCachedData(
              () => ({ type: "welcome", payload: { time: Date.now() } } as any)
            );
          });

          socket.addEventListener("message", (ev) => {
            try {
              const data = JSON.parse(ev.data);
              updateCachedData(() => data);
            } catch (err) {
              updateCachedData(
                () =>
                  ({ type: "error", payload: { message: "bad-json" } } as any)
              );
            }
          });

          socket.addEventListener("close", (evt) => {
            updateCachedData(
              () =>
                ({
                  type: "closed",
                  payload: { code: evt.code, reason: evt.reason },
                } as any)
            );
            socket = null;
            if (!manualClose) {
              const timeout = Math.min(
                30000,
                1000 * Math.pow(2, reconnectAttempt)
              );
              setTimeout(() => connect(), timeout);
            }
          });

          socket.addEventListener("error", (e) => {
            updateCachedData(
              () =>
                ({ type: "error", payload: { message: "socket-error" } } as any)
            );
          });
        };

        connect();

        const controller = {
          send: (d: any) => {
            if (socket && socket.readyState === WebSocket.OPEN)
              socket.send(JSON.stringify(d));
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
