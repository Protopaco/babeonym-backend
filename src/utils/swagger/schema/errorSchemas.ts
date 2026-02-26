const errorSchemas = {
  ErrorResponse: {
    type: "object",
    required: ["error", "message"],
    properties: {
      error: {
        type: "string",
        enum: ["db_error", "server_error"],
      },
      message: {
        type: "string",
      },
    },
  },
};

export default errorSchemas;
