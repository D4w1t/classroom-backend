import type { Request } from "express";
import { auth } from "../lib/auth.js";

const buildHeadersFromRequest = (request: Request): Headers => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === "string") {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(","));
    }
  }

  return headers;
};

export const expressAuthentication = async (
  request: Request,
  securityName: string,
  _scopes?: string[],
): Promise<unknown> => {
  if (securityName !== "cookieAuth" && securityName !== "bearerAuth") {
    const err = new Error("Unknown security scheme");
    (err as { status?: number }).status = 401;
    throw err;
  }

  let session;
  try {
    session = await auth.api.getSession({
      headers: buildHeadersFromRequest(request),
    });
  } catch (error) {
    // Infrastructure failure — let it propagate as-is
    throw error;
  }

  if (!session?.user) {
    const err = new Error("Unauthorized");
    (err as { status?: number }).status = 401;
    throw err;
  }

  const role = session.user.role;
  const normalizedRole =
    role === "admin" || role === "teacher" || role === "student"
      ? role
      : undefined;

  const userContext: Request["user"] = {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
    imageCldPubId: session.user.imageCldPubId ?? null,
  };

  if (normalizedRole) {
    userContext.role = normalizedRole;
  }

  request.user = userContext;
  return userContext;
};
