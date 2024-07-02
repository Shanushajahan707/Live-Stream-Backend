import express  from "express";
import cors from "cors";
import session from "express-session"; 
import dotenv from "dotenv";
import path from "path";
// import { Server as httpServer } from "http";
import passport from "passport";
import "./auth/passport"; 
// import { configureSocket } from "./socket/signellingServer";

dotenv.config();
const app = express();
// const server = new httpServer(app);

// Middleware setup
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));;

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// configureSocket(server);

export default app;
