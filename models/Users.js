const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: {
      type: Boolean,
      default: false,
    },
    imagesUrls: { type: Array },
    imagesPublicIds: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
