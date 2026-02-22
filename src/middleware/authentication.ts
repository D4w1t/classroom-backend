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
    return null;
  }

  try {
    const headers = buildHeadersFromRequest(request);
    const session = await auth.api.getSession({ headers });

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

    return session;
  } catch (error) {
    const err = new Error("Unauthorized");
    (err as { status?: number }).status = 401;
    throw err;
  }
};
