const etymologySchemas = {
  EtymologyLanguage: {
    type: "object",
    required: ["id", "label", "flag"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
      flag: { type: "string", nullable: true },
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
    required: ["short", "long", "dateCreated", "dateUpdated"],
    properties: {
      short: { type: "string", nullable: true },
      long: { type: "string", nullable: true },
      dateCreated: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      dateUpdated: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
    },
  },

  Etymology: {
    type: "object",
    required: [
      "givenCustomNameBridgeId",
      "givenName",
      "languages",
      "cultures",
      "meaning",
    ],
    properties: {
      givenCustomNameBridgeId: { type: "integer" },
      givenName: { type: "string" },
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
      meaning: {
        $ref: "#/components/schemas/EtymologyMeaning",
      },
    },
  },
} as const;

export default etymologySchemas;
