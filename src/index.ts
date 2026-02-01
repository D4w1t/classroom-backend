import AgentAPI from "apminsight";
AgentAPI.config();

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import subjectsRouter from "./routes/subjects.js";
import usersRouter from "./routes/users.js";
import departmentsRouter from "./routes/departments.js";
import statsRouter from "./routes/stats.js";

import securityMiddleware from "./middleware/security.js";

import { auth } from "./lib/auth.js";

import setupSwagger from "./utils/swagger.js";

const app = express();
const PORT = Number(process.env.PORT ?? 8080);

if (!process.env.FRONTEND_URL)
  throw new Error("FRONTEND_URL is required in environment variables");

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is required in environment variables");
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(securityMiddleware);

// Ensure cross-site cookies are set with SameSite=None and Secure
app.use((req, res, next) => {
  const originalSetHeader = res.setHeader.bind(res);
  res.setHeader = (name, value) => {
    if (String(name).toLowerCase() === "set-cookie" && value) {
      const cookies = Array.isArray(value) ? value : [String(value)];
      const modified = cookies.map((cookie) => {
        if (!/samesite=/i.test(cookie)) {
          cookie += "; SameSite=None";
        } else {
          cookie = cookie.replace(/SameSite=[^;]+/i, "SameSite=None");
        }
        if (!/;\s*secure/i.test(cookie)) {
          cookie += "; Secure";
        }
        return cookie;
      });
      return originalSetHeader("Set-Cookie", modified);
    }
    return originalSetHeader(name, value);
  };
  next();
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Hello, Welcome to Classroom API");
});

app.use("/api/subjects", subjectsRouter);
app.use("/api/users", usersRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/stats", statsRouter);

(async () => {
  try {
    const routesModule = await import("./routes/routes.js");
    if (routesModule && typeof routesModule.RegisterRoutes === "function") {
      const apiRouter = express.Router();
      app.use("/api", apiRouter);

      routesModule.RegisterRoutes(apiRouter);
    }
  } catch (err) {
    console.error("Failed to register TSOA routes:", err);
  }
})();

// JSON error handler: always return structured JSON errors and use err.status if provided
app.use((err: any, req: any, res: any, next: any) => {
  const status =
    err?.status ||
    err?.statusCode ||
    (res?.statusCode && res.statusCode >= 400 ? res.statusCode : 500);

  res.status(status).json({ error: err?.message ?? "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  setupSwagger(app, PORT);
});

export default app;
