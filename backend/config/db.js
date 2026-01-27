const mongoose = require("mongoose");

const connectDB = async () => {
  const normalizeUri = (uri) => {
    if (!uri || typeof uri !== "string") return uri;
    // Be tolerant of quotes in `.env` values.
    return uri
      .trim()
      .replace(/^"(.+)"$/, "$1")
      .replace(/^'(.+)'$/, "$1");
  };

  const uri = normalizeUri(process.env.MONGODB_URI);
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to backend/.env (MongoDB Atlas connection string or mongodb://localhost:27017/portfolio).",
    );
  }

  try {
    // Helpful connection lifecycle logs (Mongoose v9 docs)
    mongoose.connection.on("connected", () =>
      console.log("MongoDB: connected"),
    );
    mongoose.connection.on("open", () => console.log("MongoDB: open"));
    mongoose.connection.on("disconnected", () =>
      console.log("MongoDB: disconnected"),
    );
    mongoose.connection.on("reconnected", () =>
      console.log("MongoDB: reconnected"),
    );
    mongoose.connection.on("disconnecting", () =>
      console.log("MongoDB: disconnecting"),
    );
    mongoose.connection.on("close", () => console.log("MongoDB: close"));
    mongoose.connection.on("error", (err) =>
      console.error("MongoDB: error", err),
    );

    const conn = await mongoose.connect(uri, {
      // Driver options (forwarded to MongoDB driver)
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Distinguish Atlas SRV DNS issues from a normal connection failure.
    if (
      typeof uri === "string" &&
      uri.startsWith("mongodb+srv://") &&
      (error?.syscall === "querySrv" || error?.syscall === "getaddrinfo")
    ) {
      console.error(
        "MongoDB Atlas SRV lookup failed. This is usually DNS/VPN/proxy/firewall (not an Atlas IP whitelist issue). Try: disable VPN/proxy, switch network (hotspot), or use the Atlas *standard* connection string (mongodb://... not mongodb+srv://).",
      );
    }
    throw error;
  }
};

module.exports = connectDB;
