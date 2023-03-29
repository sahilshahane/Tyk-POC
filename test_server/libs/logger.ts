import winston from "winston";
import * as fs from "fs";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "http";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const timestamp = Date.now();

// create logs folder
if (!fs.existsSync(`logs`)) fs.mkdirSync("logs");

// create session timestamp folder
if (!fs.existsSync(`logs`)) fs.mkdirSync(`logs/${timestamp}`);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: `logs/${timestamp}/error.log`,
    level: "error",
  }),
  new winston.transports.File({ filename: `logs/${timestamp}/all.log` }),
];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
