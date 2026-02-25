const userSchemas = {
  User: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "number",
        example: 123,
      },
      email: {
        type: "string",
        format: "email",
        nullable: true,
      },
      username: {
        type: "string",
        nullable: true,
      },
      authProvider: {
        type: "string",
        nullable: true,
        description: "AuthProvider enum value",
      },
      theme: {
        type: "string",
        nullable: true,
      },
      surName: {
        type: "string",
        nullable: true,
      },
    },
  },
};

export default userSchemas;
