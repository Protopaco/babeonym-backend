const givenNameSchemas = {
  GivenNameMutationResponse: {
    type: "object",
    required: ["approvedGivenNames", "user"],
    properties: {
      approvedGivenNames: {
        type: "array",
        items: { $ref: "#/components/schemas/GivenName" },
      },
      user: {
        type: "object",
        required: ["promptAccountCreation"],
        properties: {
          promptAccountCreation: {
            type: "boolean",
            description:
              "The user has reached a point where offering account creation is worthwhile. Always false for users who are not anonymous.",
            example: false,
          },
        },
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
