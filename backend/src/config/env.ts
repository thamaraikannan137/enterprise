import dotenv from "dotenv";

dotenv.config();

interface Env {
  NODE_ENV: "development" | "staging" | "production";
  PORT: string;
  
  // JWT
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  
  // CORS
  CORS_ORIGIN: string;
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: string;
  RATE_LIMIT_MAX_REQUESTS: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
};

const validateEnv = (): Env => {
  const nodeEnv = process.env.NODE_ENV || "development";
  if (!["development", "staging", "production"].includes(nodeEnv)) {
    console.error(`❌ Invalid NODE_ENV: ${nodeEnv}. Must be one of: development, staging, production`);
    process.exit(1);
  }

  const jwtSecret = getEnvVar("JWT_SECRET");
  if (jwtSecret.length < 32) {
    console.error("❌ JWT_SECRET must be at least 32 characters long");
    process.exit(1);
  }

  return {
    NODE_ENV: nodeEnv as "development" | "staging" | "production",
    PORT: getEnvVar("PORT", "3000"),
    JWT_SECRET: jwtSecret,
    JWT_ACCESS_EXPIRATION: getEnvVar("JWT_ACCESS_EXPIRATION", "15m"),
    JWT_REFRESH_EXPIRATION: getEnvVar("JWT_REFRESH_EXPIRATION", "7d"),
    CORS_ORIGIN: getEnvVar("CORS_ORIGIN", "*"),
    RATE_LIMIT_WINDOW_MS: getEnvVar("RATE_LIMIT_WINDOW_MS", "900000"),
    RATE_LIMIT_MAX_REQUESTS: getEnvVar("RATE_LIMIT_MAX_REQUESTS", "100"),
  };
};

const env = validateEnv();

export default env;
