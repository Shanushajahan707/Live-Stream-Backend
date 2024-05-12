import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import Session from "express-session";
import dotenv from "dotenv";
import "./auth/passport";
import passport from "passport";
import path from "path";
// import path from "path";
dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(bodyparser.json());
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


export default app;
