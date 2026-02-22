declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: "student" | "teacher" | "admin";
        imageCldPubId?: string | null;
      };
    }
  }
}

export {};