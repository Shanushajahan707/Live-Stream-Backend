export const corsOptions = {
  // origin: 'http://localhost:4200', // Allow all origins
  origin: "https://capture-live.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
