const themeSchemas = {
  V1UserThemeRequest: {
    type: "object",
    required: ["theme"],
    properties: {
      theme: { type: "string", description: "Theme identifier" },
    },
  },
} as const;

export default themeSchemas;
