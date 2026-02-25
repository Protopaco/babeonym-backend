const authSchemas = {
  V1AuthAnonymous200Response: {
    type: "object",
    required: ["message", "user"],
    properties: {
      message: { type: "string", example: "Anonymous session created" },
      user: { $ref: "#/components/schemas/User" },
    },
  },

  V1AuthAnonymous400Response: {
    type: "object",
    required: ["error"],
    properties: {
      error: { type: "string", example: "User is already authenticated" },
    },
  },
} as const;

export default authSchemas;
