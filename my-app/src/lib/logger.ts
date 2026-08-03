import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDevelopment ? "debug" : "info"),
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  ...(isDevelopment
    ? {
        transport: {
          target: "pino/file",
          options: { destination: 1 }, // stdout
        },
      }
    : {}),
});
