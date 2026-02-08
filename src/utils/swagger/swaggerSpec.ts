import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Babeonym API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000", // Your development server
        description: "Development server",
      },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["error", "message"],
          properties: {
            error: {
              type: "string",
              enum: ["db_error", "server_error"],
            },
            message: {
              type: "string",
            },
          },
        },
        User: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "number",
              example: 123,
            },
            email: {
              type: "string",
              format: "email",
              nullable: true,
            },
            username: {
              type: "string",
              nullable: true,
            },
            authProvider: {
              type: "string",
              nullable: true,
              description: "AuthProvider enum value",
            },
            theme: {
              type: "string",
              nullable: true,
            },
            surName: {
              type: "string",
              nullable: true,
            },
          },
        },
        GivenName: {
          type: "object",
          required: ["givenName", "givenCustomNameBridgeId", "rating"],
          properties: {
            givenName: {
              type: "string",
              example: "Oliver",
            },
            givenCustomNameBridgeId: {
              type: "number",
              example: 42,
            },
            rating: {
              type: "number",
              example: 1000,
            },
            percentile: {
              type: "number",
              nullable: true,
              example: 92,
            },
            gender: {
              type: "string",
              nullable: true,
              description: "Key of Gender enum",
              example: "male",
            },
          },
        },
        NotAuthenticatedResponse: {
          type: "object",
          required: ["message"],
          properties: {
            message: { type: "string", example: "Not authenticated" },
          },
        },
        Decade: {
          type: "object",
          required: ["id", "decade", "label"],
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            decade: {
              type: "number",
              example: 1990,
            },
            label: {
              type: "string",
              example: "1990s",
            },
          },
        },
        Language: {
          type: "object",
          required: ["id", "label"],
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            label: {
              type: "string",
              example: "French",
            },
          },
        },
        Culture: {
          type: "object",
          required: ["id", "label"],
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            label: {
              type: "string",
              example: "Amish",
            },
          },
        },
        UserActionHistory: {
          type: "object",
          required: [
            "givenName",
            "state",
            "dateUpdated",
            "givenCustomNameBridgeId",
          ],
          properties: {
            givenName: {
              type: "string",
              example: "Oliver",
            },
            state: {
              type: "string",
              description: "NameState enum value",
              example: "APPROVED",
            },
            dateUpdated: {
              type: "string",
              format: "date-time",
              example: "2026-02-01T18:42:00Z",
            },
            givenCustomNameBridgeId: {
              type: "number",
              example: 123,
            },
          },
        },
        UserSettings: {
          type: "object",
          required: ["userId", "theme", "surName"],
          properties: {
            userId: {
              type: "number",
              example: 123,
            },
            theme: {
              type: "string",
              description: "Theme enum key",
              example: "LIGHT",
            },
            surName: {
              type: "string",
              example: "Stevens",
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad request (DB constraint violation)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Conflict: {
          description: "Conflict (duplicate entry)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../../routes/v1/**/*.js"),
    path.join(__dirname, "../../routes/v1/*.js"),
    path.join(__dirname, "../../routes/v1/**/*.ts"),
    path.join(__dirname, "../../routes/v1/*.ts"),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerOptions, swaggerSpec };
