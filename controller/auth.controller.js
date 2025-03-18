const User = require("../models/user.model");
const errorHandler = require("../utils/error.handler");
const resposcha = require("../utils/resposcha");
const bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

let registerUser = errorHandler(async (req, res, next) => {
  let { email, username, password, name } = req.body;
  if (!email || !username || !password || !name) {
    throw new Error("Ma'lumotlar to'liq emas");
  }

  let [existUser, existUserEmail] = await Promise.all([
    User.find({ username: username }),
    User.find({ email: email }),
  ]);
  if (existUser.length || existUserEmail.length) {
    throw new Error(`boshqa ${existUser.length ? "username" : "email"} qo'y`);
  }

  let user = await User.create({ email, username, password, name });
  resposcha(res, 200, {
    message: "Siz muvaffaqiyat ro'yxatdan o'tdingiz",
    user,
  });
});

let login = errorHandler(async (req, res, next) => {
  let { username, password } = req.body;
  if (!username || !password)
    throw new Error("username yoki password berilmagan");
  let user = await User.findOne({ username }).select(
    "password username email name role"
  );
  if (!user) throw new Error("Siz oldin ro'yxat o'tmagansiz ");

  let checking = await bcrypt.compare(password, user.password);
  if (!checking) throw new Error("password xato kiritilgan berilmagan");
  console.log(user.password, checking);
  let token = await jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_TOKEN_SECRET_KEY,
    { expiresIn: "1h" }
  );
  console.log(token);

  resposcha(res, 200, { user, token });
});
module.exports = { registerUser, login };
