import mongoose from "mongoose";
import { env } from "./env";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connection() {
  if (cached.conn) return cached.conn;

  const DATABASE = env.database;

  if (!DATABASE) {
    throw new Error("Please define DATABASE environment variable");
  }
  

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(DATABASE, { bufferCommands: false })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}