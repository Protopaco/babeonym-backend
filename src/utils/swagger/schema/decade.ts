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
};

export default decadeSchema;
