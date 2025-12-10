export type WSMessage =
  | { type: "connecting"; payload: { attempt: number; time: number } }
  | { type: "welcome"; payload: { message: string; time: number } }
  | { type: "heartbeat"; payload: { time: number } }
  | {
      type: "chat";
      payload: { username: string; message: string; time: number };
    }
  | {
      type: "closed";
      payload: { code?: number; reason?: string; time: number };
    }
  | { type: "error"; payload: { message: string; time: number } };
