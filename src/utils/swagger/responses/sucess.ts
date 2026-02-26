const successResponse = {
  SuccessResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: { type: "string" },
    },
  },
};

export default successResponse;
