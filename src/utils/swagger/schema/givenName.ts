const givenNameSchemas = {
  ApprovedGivenNamesResponse: {
    type: "object",
    required: ["approvedGivenNames"],
    properties: {
      approvedGivenNames: {
        type: "array",
        items: { $ref: "#/components/schemas/GivenName" },
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
};

export default givenNameSchemas;
