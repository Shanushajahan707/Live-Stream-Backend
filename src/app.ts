import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session"; // Use lowercase 'session' import
import dotenv from "dotenv";
import path from "path";
import { Server as httpServer } from "http";
import passport from "passport";
import "./auth/passport"; 
import { configureSocket } from "./socket/signellingServer";
import './utils/session'; 

dotenv.config();
const app = express();
const server = new httpServer(app);

// Middleware setup
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: "secret",
  cookie: { secure: false } // Use secure: true in production with HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

configureSocket(server);

export default app;
