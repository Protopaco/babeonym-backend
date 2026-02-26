const cultureSchemas = {
  CultureRegionCulture: {
    type: "object",
    required: ["id", "label"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
    },
  },

  CultureRegion: {
    type: "object",
    required: ["id", "label", "cultures"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
      cultures: {
        type: "array",
        items: {
          $ref: "#/components/schemas/CultureRegionCulture",
        },
      },
    },
  },

  CultureWithRegions: {
    type: "object",
    required: ["id", "label", "regions"],
    properties: {
      id: { type: "integer" },
      label: { type: "string" },
      regions: {
        type: "array",
        items: {
          $ref: "#/components/schemas/CultureRegion",
        },
      },
    },
  },
  ReferenceCulturesResponse: {
    type: "object",
    required: ["cultures"],
    properties: {
      cultures: {
        type: "array",
        items: { $ref: "#/components/schemas/CultureWithRegions" },
      },
    },
  },
} as const;

export default cultureSchemas;
