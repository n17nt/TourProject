const mongoose = require("mongoose");
let TourSChema = mongoose.Schema(
  {
    image: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    location: { type: String, required: true, default: "Amir temur st 123A" },
    guides: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

let Tour = mongoose.model("tours", TourSChema);
module.exports = Tour;
