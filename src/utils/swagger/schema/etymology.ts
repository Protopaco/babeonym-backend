const etymologySchemas = {
  EtymologyLanguage: {
    type: "object",
    required: ["id", "label", "flag"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
      flag: { type: "string" },
    },
  },

  EtymologyCulture: {
    type: "object",
    required: ["id", "label"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
    },
  },

  EtymologyMeaning: {
    type: "object",
    required: ["id", "text", "language"],
    properties: {
      id: { type: "integer" },
      text: { type: "string" },
      language: {
        allOf: [{ $ref: "#/components/schemas/EtymologyLanguage" }],
        nullable: true,
      },
    },
  },

  Etymology: {
    type: "object",
    required: ["meanings", "languages", "cultures"],
    properties: {
      meanings: {
        type: "array",
        items: {
          $ref: "#/components/schemas/EtymologyMeaning",
        },
      },
      languages: {
        type: "array",
        items: {
          $ref: "#/components/schemas/EtymologyLanguage",
        },
      },
      cultures: {
        type: "array",
        items: {
          $ref: "#/components/schemas/EtymologyCulture",
        },
      },
    },
  },
} as const;

export default etymologySchemas;
