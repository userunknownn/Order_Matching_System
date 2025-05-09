import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;

export const connectSocket = (token: string) => {
  socket = io("http://127.0.0.1:3000", {
    auth: { token },
    transports: ["websocket"],
  });

  pingInterval = setInterval(() => {
    if (socket?.connected) {
      socket.emit("ping");
    }
  }, 30000); 
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

