const settingsSchemas = {
  V1UserSettingsRequest: {
    type: "object",
    properties: {
      surName: {
        type: "string",
        nullable: true,
        description: "User surname. Omit or send null to leave it unset.",
      },
    },
  },

  UserSettingsResponse: {
    type: "object",
    required: ["settings"],
    properties: {
      settings: { $ref: "#/components/schemas/UserSettings" },
    },
  },
} as const;

export default settingsSchemas;
