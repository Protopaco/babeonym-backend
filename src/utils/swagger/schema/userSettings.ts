const userSettingsSchemas = {
  UserSettings: {
    type: "object",
    required: ["userId", "theme"],
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
        nullable: true,
        example: "Stevens",
      },
    },
  },
};

export default userSettingsSchemas;
