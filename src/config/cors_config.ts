export const corsOption = {
  origin: process.env.FRONTEND_URL || "http://localhost:4200/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  credentials: true,
};
