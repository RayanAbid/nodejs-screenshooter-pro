const Users = require("../models/Users");
const NoAuthImage = require("../models/NoAuthImage");
const router = require("express").Router();

const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { takeScreenshot, uploadScreenshot } = require("../utils/functions");
const { cloudinary } = require("../utils/cloudinary");
const cron = require("node-cron");

// Create an express route
router.post("/upload", (req, res) => {
  console.log("api called");
  const { url } = req.body;
  takeScreenshot(url)
    .then((screenshot) => uploadScreenshot(screenshot))
    .then(async (result) => {
      const newImage = new NoAuthImage({
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      });
      const user = await newImage.save();
      res.json({ success: true, message: "Success", data: user });
    });
});

// Delete image
router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    // delete quiz
    const image = await NoAuthImage.findById({ _id });
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(image.imagePublicId);
    // Delete user from db
    await image.remove();
    res.json({
      success: true,
      message: "the post has been deleted",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

cron.schedule("0 * * * *", async () => {
  // router.get("/testers", async (req, res) => {
  // code

  try {
    // delete quiz
    const images = await NoAuthImage.find({
      createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) },
    });

    await Promise.all(
      images.map(async (image) => {
        console.log("testers", image);
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(image.imagePublicId);
        // Delete user from db
        await image.remove();
      })
    );

    // await res.json({
    //   success: true,
    //   message: "the posts has been deleted",
    // });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
