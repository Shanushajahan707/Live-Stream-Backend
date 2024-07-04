import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import "./auth/passport"; 
import { corsOption } from "./config/cors_config";

dotenv.config();
const app = express();

// Middleware setup
app.use(cors(corsOption));
app.options('*', cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


export default app;
