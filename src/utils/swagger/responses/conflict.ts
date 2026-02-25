const conflictResponse = {
  Conflict: {
    description: "Conflict (duplicate entry)",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
};

export default conflictResponse;
