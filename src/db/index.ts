import { drizzle } from "drizzle-orm/mysql2";
import mysql, { ConnectionOptions } from "mysql2/promise";

// Detect if running in Cloudflare Workers environment
const isCloudflareWorker = typeof globalThis !== "undefined" && "Cloudflare" in globalThis;

// Database instance for Node.js environment
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function db() {
  const databaseUrl = process.env.DATABASE_HOST;
  if (!databaseUrl) {
    throw new Error("DATABASE_HOST is not set");
  }

  const connectionOptions: ConnectionOptions = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT!),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };

  // In Cloudflare Workers, create new connection each time
  if (isCloudflareWorker) {
    // Workers environment uses minimal configuration
    const pool = mysql.createPool({
      ...connectionOptions,
      connectionLimit: 1,
    });

    return drizzle(pool);
  }

  // In Node.js environment, use singleton pattern
  if (dbInstance) {
    return dbInstance;
  }

  // Node.js environment with connection pool configuration
  const pool = mysql.createPool({
    ...connectionOptions,
    connectionLimit: 10,
    maxIdle: 10,
  });

  dbInstance = drizzle(pool);

  return dbInstance;
}
