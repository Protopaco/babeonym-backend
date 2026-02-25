const notAuthenticatedResponse = {
  NotAuthenticatedResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: { type: "string", example: "Not authenticated" },
    },
  },
};

export default notAuthenticatedResponse;
