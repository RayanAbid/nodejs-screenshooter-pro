const mongoose = require("mongoose");

const NoAuthImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, unique: true },
    imagePublicId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NoAuthImage", NoAuthImageSchema);
