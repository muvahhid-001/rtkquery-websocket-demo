export type WSMessage =
  | { type: "welcome"; payload: { message: string; time: number } }
  | { type: "heartbeat"; payload: { time: number } }
  | {
      type: "chat";
      payload: { username: string; message: string; time: number };
    };
