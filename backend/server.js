require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./src/routes/posts");

const app = express();
const PORT = process.env.PORT || 5009;
const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST // Set by jest setup
    : process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);

// Global error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

let server;

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI not defined. Ensure .env is set up or MONGO_URI_TEST for test env."
      );
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");
    server = app.listen(PORT, () =>
      console.log(`Backend server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Failed to connect to MongoDB or start server:", err.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  // Don't auto-start server in test mode
  startServer();
}

module.exports = { app, startServer, mongoose }; // Export for testing
