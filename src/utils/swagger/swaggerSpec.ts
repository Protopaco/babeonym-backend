import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

import schemas from "./schema/index";
import responses from "./responses/index";

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
      schemas,
      responses,
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
