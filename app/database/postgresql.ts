import postgres from "postgres";

export const sql: any = postgres({
  host: process.env.pgHost,
  port: Number(process.env.pgPort),
  database: process.env.pgName,
  user: process.env.pgUser,
  password: process.env.pgPassword,
  ssl: {
    rejectUnauthorized: false
  }
});