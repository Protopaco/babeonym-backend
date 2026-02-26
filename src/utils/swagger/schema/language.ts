const languageSchemas = {
  LanguageRegionLanguage: {
    type: "object",
    required: ["id", "label", "flag"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
      flag: { type: "string", nullable: true },
    },
  },

  LanguageRegion: {
    type: "object",
    required: ["id", "label", "languages"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
      languages: {
        type: "array",
        items: {
          $ref: "#/components/schemas/LanguageRegionLanguage",
        },
      },
    },
  },

  LanguageWithRegions: {
    type: "object",
    required: ["id", "label", "regions"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
      regions: {
        type: "array",
        items: {
          $ref: "#/components/schemas/LanguageRegion",
        },
      },
    },
  },
  Languages: {
    type: "array",
    items: {
      $ref: "#/components/schemas/LanguageWithRegions",
    },
  },
  ReferenceLanguagesResponse: {
    type: "object",
    required: ["languages"],
    properties: {
      languages: {
        $ref: "#/components/schemas/Languages",
      },
    },
  },
} as const;

export default languageSchemas;
