import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {

  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  (global as any).io = io;

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("register-notification-stream", (userId: number) => {
      if (!userId) return;
      const userChannel = `user-channel-${userId}`;
      socket.join(userChannel);
      console.log(`User ID ${userId} registered to notification stream: ${userChannel}`);
    });
    

    socket.on("join-room", ({ room, username }: { room: string; username: string }) => {
      if (!room || !username) return;
      socket.join(room);
      console.log(`User ${username} joined room ${room}`);
      socket.to(room).emit("user_joined", `${username} joined room ${room}`);
    });


    socket.on("message", (data) => {
      if (!data?.room) return;
      socket.to(data.room).emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});