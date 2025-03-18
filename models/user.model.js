const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
let TourGudeSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    experience: { type: Number, default: 0 },
    email: {
      type: String,
      required: [true, "email raqami kiritilishi shart"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email xato bor"],
    },
    username: { type: String, unique: true, required: true, minLength: 4 },
    password: {
      type: String,
      required: [true, "Parolni kiritish majburiy"],
      select: false,
      validate: [validator.isStrongPassword, "Kuchliroq parol qo'ying"],
    },
    role: { type: String, enum: ["user", "guide", "admin"], default: "user" },
    refreshToken: { type: String },
    active: { type: Boolean, default: true, select: false },
    //   tours: [{ type: mongoose.Schema.Types.ObjectId, ref: "tours" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

TourGudeSchema.pre("save", async function (next) {
  let password = this.password;
  this.password = await bcrypt.hash(password, 12);
  console.log(this.password);

  next();
});
TourGudeSchema.post(/^find/, async function () {
  this.where({ password: { select: false } });
});

TourGudeSchema.virtual("tours", {
  ref: "tours",
  localField: "_id",
  foreignField: "guides",
});

let User = mongoose.model("users", TourGudeSchema);
module.exports = User;
