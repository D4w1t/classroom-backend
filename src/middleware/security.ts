import type { Request, Response, NextFunction } from "express";
import aj from "../config/arcjet.js";
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";

import { RateLimitRole } from "../type.js";

const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "test") return next();

  try {
    const role: RateLimitRole = req.user?.role ?? "guest";

    let limit: number;
    let message: string;

    switch (role) {
      case "admin":
        limit = 20;
        message = "Admin rate limit exceeded. Slow down!";
        break;
      case "teacher":
      case "student":
        limit = 10;
        message = "User rate limit exceeded. Please wait a moment.";
        break;
      default:
        limit = 5;
        message = "Rate limit exceeded. Please sign in or wait a moment.";
    }

    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit,
      }),
    );

    // Determine a stable remote address for rate-limiting buckets.
    // Prefer socket.remoteAddress -> req.ip -> x-forwarded-for header -> generated id.
    let remoteAddress = req.socket.remoteAddress ?? req.ip ?? undefined;

    if (!remoteAddress) {
      const xff = (req.headers["x-forwarded-for"] as string | undefined)
        ?.split(",")[0]
        ?.trim();
      if (xff) {
        remoteAddress = xff;
      } else {
        // No network address available; create a short request-scoped id so
        // buckets don't collide across requests. Warn so this is observable.
        const { randomBytes } = await import("crypto");
        const fallback = `anon-${randomBytes(6).toString("hex")}`;
        const warnFn = (global as any).processLogger?.warn ?? console.warn;
        warnFn?.(
          "security middleware: missing remote address; using fallback id %s for %s %s",
          fallback,
          req.method,
          req.originalUrl || req.url,
        );
        remoteAddress = fallback;
      }
    }

    const arcjetRequest: ArcjetNodeRequest = {
      // pass role to Arcjet so base rules can make role-based decisions
      headers: {
        ...req.headers,
        "x-role": role,
      },
      method: req.method,
      url: req.originalUrl || req.url,
      socket: {
        remoteAddress,
      },
    };

    const decision = await client.protect(arcjetRequest);

    if (decision.isDenied() && decision.reason.isBot()) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied. Bot traffic is not allowed.",
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied. Suspicious activity detected.",
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      return res.status(429).json({
        error: "Too Many Requests",
        message,
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong with the security middleware",
    });
  }
};

export default securityMiddleware;
