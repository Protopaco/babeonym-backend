const orderSchemas = {
  V1GivenNameOrderRequest: {
    type: "object",
    required: ["givenCustomNameBridgeIds"],
    properties: {
      givenCustomNameBridgeIds: {
        type: "array",
        description:
          "The user's approved names in their new order, highest ranked first.",
        items: {
          type: "integer",
        },
        example: [42, 17, 8],
      },
    },
  },
} as const;

export default orderSchemas;
