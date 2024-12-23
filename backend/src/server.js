const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
const dotenv = require("dotenv");
const { tagRouter } = require("./routes/tagRoutes");
const { bootstrapTags } = require("./utils");
const collectionRouter = require("./routes/collectionRoutes");
const commentRouter = require("./routes/commentRoutes");

// Initialize Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

app.use("/users", userRoutes);
app.use("/images", imageRoutes);
app.use("/tags", tagRouter);
app.use("/collections", collectionRouter);
app.use("/comments", commentRouter);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  bootstrapTags();
  console.log(`Server running on http://localhost:${PORT}`);
});
