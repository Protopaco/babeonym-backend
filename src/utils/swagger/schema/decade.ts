const decadeSchema = {
  Decade: {
    type: "object",
    required: ["id", "decade", "label"],
    properties: {
      id: {
        type: "number",
        example: 1,
      },
      decade: {
        type: "number",
        example: 1990,
      },
      label: {
        type: "string",
        example: "1990s",
      },
    },
  },
  ReferenceDecadesResponse: {
    type: "object",
    required: ["decades"],
    properties: {
      decades: {
        type: "array",
        items: { $ref: "#/components/schemas/Decade" },
      },
    },
  },
} as const;

export default decadeSchema;
