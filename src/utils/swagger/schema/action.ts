const actionSchemas = {
  V1GivenNameActionRequest: {
    type: "object",
    required: ["givenCustomNameBridgeId", "newState"],
    properties: {
      givenCustomNameBridgeId: {
        type: "integer",
        example: 123,
      },
      newState: {
        type: "string",
        enum: ["APPROVED", "REJECTED", "SNOOZED"],
        example: "APPROVED",
      },
    },
  },
} as const;

export default actionSchemas;
