const mongoose = require("mongoose");
const logger = require("../utils/logger");

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
    mongoose.connection.on("connected", () => logger.info("MongoDB connected"));
    mongoose.connection.on("open", () => logger.debug("MongoDB open"));
    mongoose.connection.on("disconnected", () =>
      logger.warn("MongoDB disconnected"),
    );
    mongoose.connection.on("reconnected", () =>
      logger.info("MongoDB reconnected"),
    );
    mongoose.connection.on("disconnecting", () =>
      logger.warn("MongoDB disconnecting"),
    );
    mongoose.connection.on("close", () => logger.warn("MongoDB close"));
    mongoose.connection.on("error", (err) =>
      logger.error("MongoDB error", {
        errorName: err?.name,
        errorMessage: err?.message,
      }),
    );

    const conn = await mongoose.connect(uri, {
      // Driver options (forwarded to MongoDB driver)
      serverSelectionTimeoutMS: 5000,
    });

    logger.info("MongoDB ready", {
      host: conn.connection.host,
      db: conn.connection.name,
    });
    return conn;
  } catch (error) {
    // Distinguish Atlas SRV DNS issues from a normal connection failure.
    if (
      typeof uri === "string" &&
      uri.startsWith("mongodb+srv://") &&
      (error?.syscall === "querySrv" || error?.syscall === "getaddrinfo")
    ) {
      logger.error("MongoDB Atlas SRV lookup failed", {
        hint: "Try: disable VPN/proxy, switch network (hotspot), or use Atlas standard connection string (mongodb://...) instead of mongodb+srv://",
      });
    }
    throw error;
  }
};

module.exports = connectDB;
