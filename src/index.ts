import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import subjectsRouter from "./routes/subjects";

import securityMiddleware from "./middleware/security";

import { auth } from "./lib/auth";

const app = express();
const PORT = 8080;

if (!process.env.FRONTEND_URL)
  throw new Error("FRONTEND_URL is required in environment variables");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use(securityMiddleware);
  
app.get("/", (req, res) => {
  res.send("Hello, Welcome to Classroom API");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use("/api/v1/subjects", subjectsRouter);
