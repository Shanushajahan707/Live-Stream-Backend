import { Server as httpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";

let io = new Server(server);

interface User {
  userId: string;
  role: string; 
}

export function configureSocket(expressServer: httpServer) {
  io = new SocketIOServer(expressServer, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    },
  });
  
  const rooms: Record<string, User[]> = {};
  const roleToSocket = new Map<string, string>();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join room", (data) => {
      const { room, role } = data;
      if (!rooms[room]) {
        rooms[room] = [];
      }
      console.log(`${socket.id} - ${role} joined ${room}`);
      rooms[room].push({ userId: socket.id, role: role });
      roleToSocket.set(role, socket.id);
      socket.join(room);
      console.log('room is',rooms);
      socket.broadcast
        .to(room)
        .emit("user joined", { role: role, id: socket.id });
    });

    socket.on('offer', (data) => {
      console.log('Offer socketId', socket.id);
      console.log('Inside offer', data.room, "sending offer to", data.id);
      io.to(data.id).emit('offer', { id: socket.id, offer: data.offer });
    });

    socket.on('answer', (data) => {
      console.log('Answer socketId', socket.id);
      console.log('Inside', data.room, "answer to", data.id);
      io.to(data.id).emit('answer', { id: socket.id, answer: data.answer });
    });

    socket.on('peer-nego-needed', (data) => {
      console.log('Peer negotiation needed');
      io.to(data.id).emit('peer-nego-needed', { id: socket.id, offer: data.offer });
    });
    
    socket.on('peer-nego-done', (data) => {
      console.log('Peer negotiation done');
      io.to(data.id).emit('peer-nego-final', { id: socket.id, answer: data.answer });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const room in rooms) {
        rooms[room] = rooms[room].filter((user) => user.userId !== socket.id);
        if (rooms[room].length === 0) {
          delete rooms[room];
        }
      }
      roleToSocket.forEach((value, key) => {
        if (value === socket.id) {
          roleToSocket.delete(key);
        }
      });
    });
  });
}
