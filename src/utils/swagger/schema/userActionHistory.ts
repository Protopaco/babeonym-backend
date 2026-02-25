const userActionHistorySchemas = {
  UserActionHistory: {
    type: "object",
    required: ["givenName", "state", "dateUpdated", "givenCustomNameBridgeId"],
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
};

export default userActionHistorySchemas;
