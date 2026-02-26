const compareSchemas = {
  V1GivenNameCompareRequest: {
    type: "object",
    required: ["winnerId", "loserId"],
    properties: {
      winnerId: { type: "integer", example: 12 },
      loserId: { type: "integer", example: 34 },
    },
  },
};

export default compareSchemas;
