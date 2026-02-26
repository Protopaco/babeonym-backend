const notAuthenticatedResponse = {
  NotAuthenticatedResponse: {
    description: "Not authenticated",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/NotAuthenticatedResponse" },
      },
    },
  },
};

export default notAuthenticatedResponse;
