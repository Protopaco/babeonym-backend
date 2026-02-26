const healthSchemas = {
  HealthStatus: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: ["ok", "error"] },
      message: { type: "string" },
    },
    additionalProperties: true,
  },
} as const;

export default healthSchemas;
