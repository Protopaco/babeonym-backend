const internalServerErrorResponse = {
  InternalServerError: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
};

export default internalServerErrorResponse;
