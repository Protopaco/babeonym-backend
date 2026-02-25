const userSettingsSchemas = {
  UserSettings: {
    type: "object",
    required: ["userId", "theme", "surName"],
    properties: {
      userId: {
        type: "number",
        example: 123,
      },
      theme: {
        type: "string",
        description: "Theme enum key",
        example: "LIGHT",
      },
      surName: {
        type: "string",
        example: "Stevens",
      },
    },
  },
};

export default userSettingsSchemas;
