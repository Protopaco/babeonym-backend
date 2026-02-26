const customSchemas = {
  V1GivenNameCustomRequest: {
    type: "object",
    required: ["customGivenName"],
    properties: {
      customGivenName: {
        type: "string",
        example: "Aurelius",
      },
    },
  },
} as const;

export default customSchemas;
