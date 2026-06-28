import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {

  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", ({ room, username }: { room: string; username: string }) => {
      if (!room || !username) {
        return;
      }

      socket.join(room);
      console.log(`User ${username} joined room ${room}`);

      socket.to(room).emit("user_joined", `${username} joined room ${room}`);
    });
    socket.on("message", (data) => {
      if (!data?.room) return;
      socket.to(data.room).emit("message", data);
    });

    socket.on("join-meeting", ({ room }: { room: string }) => {
      if (!room) return;
      const existingPeers = Array.from(io.sockets.adapter.rooms.get(room) || []);
      socket.join(room);
      console.log(`${socket.id} joined meeting room ${room}`);
      socket.emit("existing-peers", existingPeers);
      socket.to(room).emit("peer-joined", socket.id);
    });
    
    socket.on("signal", ({ to, signal }: { to: string; signal: any }) => {
      if (!to) return;
      io.to(to).emit("signal", { from: socket.id, signal });
    });

    socket.on("leave-meeting", ({ room }: { room: string }) => {
      if (!room) return;
      socket.leave(room);
      socket.to(room).emit("peer-left", socket.id);
    });

    socket.on("end-meeting", ({ room }: { room: string }) => {
      if (!room) return;
      io.to(room).emit("meeting-ended");
    });

   socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit("peer-left", socket.id);
        }
      });
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