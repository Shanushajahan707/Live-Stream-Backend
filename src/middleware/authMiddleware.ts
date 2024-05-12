import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../entities/User";

dotenv.config();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_LOGIN as string, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user as User;
      console.log("user from the auth middleware");
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default authMiddleware;
