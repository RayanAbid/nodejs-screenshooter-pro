const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB Connection Successfull!");

    // User route
    const userRoute = require("./routes/Users");
    app.use("/auth", userRoute);
    // Image route
    const imageRoute = require("./routes/ImageUpload");
    app.use("/images", imageRoute);

    //   home endpoint
    app.get("/", (req, res) => {
      res.send("Screenshot rest apis");
    });

    app.listen(process.env.PORT || 3001, () => {
      console.log("Started");
    });
  }
);
