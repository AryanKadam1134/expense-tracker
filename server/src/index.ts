import "dotenv/config";
import app from "./app";

import { getEnv } from "./utils/getEnv";

import { connectDB } from "./db/connectDB";

const port = getEnv("PORT") || 3000;

connectDB()
  .then((res) => {
    const info = res.connection;

    console.log("✅ MongoDB is connected successfully!");
    console.log(`👾 Host: ${info.host}`);

    const server = app.listen(port, () => {
      console.log(`🤖 Server running on port: ${port}`);
    });

    server.on("error", (error) => {
      console.error("❌ Server error: ", error);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed!");
    console.error(error);
  });
