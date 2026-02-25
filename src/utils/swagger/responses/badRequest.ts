const badRequestResponse = {
  BadRequest: {
    description: "Bad request (DB constraint violation)",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
};

export default badRequestResponse;
