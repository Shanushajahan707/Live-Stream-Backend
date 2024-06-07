import { Server as httpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

interface User {
  userId: string;
  role: string;
}

export function configureSocket(expressServer: httpServer) {
  const io = new SocketIOServer(expressServer, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  const rooms: Record<string, User[]> = {};
  const broadcasters: Record<string, string> = {}; // Store broadcaster socket IDs by room

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("join room", (data) => {
      console.log('data is ',data)
      const { room, role } = data;
      if (!rooms[room]) {
        rooms[room] = [];
      }
      rooms[room].push({ userId: socket.id, role: role });
      if (role === "broadcaster") {
        broadcasters[room] = socket.id;
        socket.join(room);
      } else {
        socket.join(room);
        if (broadcasters[room]) {
          io.to(broadcasters[room]).emit("viewer-joined", socket.id);
        }
      }
      consoleLogRoomParticipants(room);
    });

    socket.on("offer", (data) => {
      io.to(data.id).emit("offer", { id: socket.id, offer: data.offer });
    });

    socket.on("answer", (data) => {
      io.to(data.id).emit("answer", { id: socket.id, answer: data.answer });
    });

    socket.on("ice-candidate", (data) => {
      io.to(data.id).emit("ice-candidate", {
        id: socket.id,
        candidate: data.candidate,
      });
    });

    socket.on("peer-nego-needed", (data) => {
      const { id, offer } = data;
      io.to(id).emit("peer-nego-needed", { id: socket.id, offer });
    });

    socket.on("peer-nego-done", (data) => {
      const { id, answer } = data;
      io.to(id).emit("peer-nego-final", { id: socket.id, answer });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      for (const room in rooms) {
        rooms[room] = rooms[room].filter((user) => user.userId !== socket.id);
        if (rooms[room].length === 0) {
          delete rooms[room];
          delete broadcasters[room];
        } else if (broadcasters[room] === socket.id) {
          delete broadcasters[room];
        }
        consoleLogRoomParticipants(room);
      }
    });
  });

  function consoleLogRoomParticipants(room: string) {
    const roomUsers = rooms[room] || [];
    const broadcastersInRoom = roomUsers.filter(user => user.role === 'broadcaster');
    const viewersInRoom = roomUsers.filter(user => user.role !== 'broadcaster');
    
    const broadcastersList = broadcastersInRoom.map(broadcaster => broadcaster.userId).join(", ");
    const viewersList = viewersInRoom.map(viewer => viewer.userId).join(", ");

    console.log(`Room: ${room}`);
    console.log(`Broadcasters: ${broadcastersInRoom.length}`);
    if (broadcastersInRoom.length > 0) {
      console.log(`Broadcaster IDs: ${broadcastersList}`);
    } else {
      console.log(`No broadcasters in the room.`);
    }

    console.log(`Viewers: ${viewersInRoom.length}`);
    if (viewersInRoom.length > 0) {
      console.log(`Viewer IDs: ${viewersList}`);
      // Broadcast broadcaster's stream to all viewers in the room
      io.to(room).emit("stream-broadcast", broadcastersList);
    } else {
      console.log(`No viewers in the room.`);
    }
  }
}
