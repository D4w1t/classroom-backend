import { Express, Response, Request } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const generatedPath = path.resolve(process.cwd(), "dist", "swagger.json");
let swaggerSpec: unknown | null = null;

if (fs.existsSync(generatedPath)) {
  try {
    const file = fs.readFileSync(generatedPath, "utf8");
    const generatedSpec = JSON.parse(file);

    generatedSpec.servers = [{ url: "/api" }];

    swaggerSpec = generatedSpec;
  } catch (err) {
    console.error("Failed to parse dist/swagger.json:", err);
    swaggerSpec = null;
  }
}

const setupSwagger = (app: Express, port: number | string) => {
  if (!swaggerSpec) {
    // In production, don't crash the server just because the generated spec is missing.
    // Skip mounting Swagger UI and continue running the API.
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "dist/swagger.json not found — skipping Swagger UI in production. Run 'npm run generate:openapi' to generate it for local/dev usage.",
      );
      return;
    }

    throw new Error(
      "OpenAPI spec not found at dist/swagger.json. Run 'npm run generate:openapi' and restart the server.",
    );
  }

  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve Swagger JSON
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};

export default setupSwagger;
