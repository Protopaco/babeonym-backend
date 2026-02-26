const settingsSchemas = {
  V1UserSettingsRequest: {
    type: "object",
    required: ["theme", "surName"],
    properties: {
      theme: { type: "string", description: "Theme identifier" },
      surName: { type: "string", description: "User surname" },
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
