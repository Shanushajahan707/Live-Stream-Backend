import express from "express";
import cors from "cors";
import Session from "express-session";
import dotenv from "dotenv";
import "./auth/passport";
import passport from "passport";
import path from "path";
import { Server as httpServer } from "http";
import { configureSocket } from "./socket/signellingServer";

// import path from "path";
dotenv.config();
const app = express();
const server = new httpServer(app);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  Session({
    resave: false,
    saveUninitialized: true,
    secret: "secret",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')))


configureSocket(server)


export default app;
