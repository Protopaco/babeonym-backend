const nameFiltersSchema = {
  FilterOption: {
    type: "object",
    required: ["id", "label", "searchText"],
    properties: {
      id: {
        type: "number",
        example: 4,
      },
      label: {
        type: "string",
        example: "Amharic",
      },
      searchText: {
        type: "string",
        description:
          "Lowercased text a type-ahead matches against. Includes the label plus any region and continent the option belongs to.",
        example: "amharic east africa africa",
      },
    },
  },
  NameFilters: {
    type: "object",
    required: [
      "genderOptions",
      "decadeOptions",
      "cultureOptions",
      "languageOptions",
    ],
    properties: {
      genderOptions: {
        type: "array",
        items: { $ref: "#/components/schemas/FilterOption" },
      },
      decadeOptions: {
        type: "array",
        items: { $ref: "#/components/schemas/FilterOption" },
      },
      cultureOptions: {
        type: "array",
        items: { $ref: "#/components/schemas/FilterOption" },
      },
      languageOptions: {
        type: "array",
        items: { $ref: "#/components/schemas/FilterOption" },
      },
    },
  },
  ReferenceNameFiltersResponse: {
    type: "object",
    required: ["nameFilters"],
    properties: {
      nameFilters: { $ref: "#/components/schemas/NameFilters" },
    },
  },
} as const;

export default nameFiltersSchema;
