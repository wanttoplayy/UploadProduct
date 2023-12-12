// utils/dbConnect.ts

import mongoose from "mongoose";

// Define a type for the connection object
interface IConnection {
  isConnected?: number;
}

// Extend the NodeJS global type with the mongoose connection and promise
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const connection: IConnection = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing database connection");
    return;
  }

  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (!global.mongoose.promise) {
    console.log("Creating new database connection");
    global.mongoose.promise = mongoose
      .connect(process.env.MONGODB_URI as string)
      .then((mongoose) => {
        console.log("Database connected!");
        return mongoose.connection;
      })
      .catch((err) => {
        console.error("Database connection error", err);
        throw err;
      });
  }
  connection.isConnected = (await global.mongoose.promise).readyState;
  console.log(`Database connection ready state: ${connection.isConnected}`);
}

export default dbConnect;
