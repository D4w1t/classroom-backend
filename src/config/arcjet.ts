import arcjet, {
  detectBot,
  shield,
  slidingWindow,
} from "@arcjet/node";

if (!process.env.ARCJET_KEY && process.env.NODE_ENV !== "test") {
  throw new Error("ARCJET_KEY is required in environment variables");
}

// Create a real client only when a key is provided. In tests we export a
// safe no-op client so we never pass `undefined` to `arcjet` at runtime.
let aj: any;

if (process.env.ARCJET_KEY) {
  aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      // Shield protects your app from common attacks e.g. SQL injection
      shield({ mode: "LIVE" }),
      // Create a bot detection rule
      detectBot({
        mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
        // Block all bots except the following
        allow: [
          "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
          "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
        ],
      }),
        // Role-based rate limiting rules
      slidingWindow({ mode: "LIVE", interval: "1m", max: 20 }), // admins
      slidingWindow({ mode: "LIVE", interval: "1m", max: 10 }), // teachers/students
      slidingWindow({ mode: "LIVE", interval: "1m", max: 5 }), // guests
    ],
  });
} else {
  // No-op mock client used in test mode (or when key is missing). It matches
  // the minimal runtime shape used by the app: `withRule(...).protect(...)`.
  const noopDecision = {
    isDenied: () => false,
    reason: {
      isBot: () => false,
      isShield: () => false,
      isRateLimit: () => false,
    },
  };

  const noopClient: any = {
    withRule: () => noopClient,
    protect: async () => noopDecision,
  };

  aj = noopClient;
}

// Centralized role limits mapping used by middleware / configuration.
export const ROLE_LIMITS = {
  admin: { interval: "1m", max: 20 },
  teacher: { interval: "1m", max: 10 },
  student: { interval: "1m", max: 10 },
  guest: { interval: "1m", max: 5 },
};

export default aj;
