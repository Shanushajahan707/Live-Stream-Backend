import session from "express-session";

declare module "express-session" {
  interface SessionData {
    otpValue: number;
  }
}

declare module 'express' {
  interface Request {
      session: session.Session & Partial<session.SessionData>;
  }
}