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
  // console.log(req.cookies);

  let { username, password } = req.body;
  if (!username || !password)
    throw new Error("username yoki password berilmagan");
  let user = await User.findOne({ username })
    .select("password username email name role")
    .exec();
  if (!user) throw new Error("Siz oldin ro'yxat o'tmagansiz ");

  console.log(req.body);

  let checking = await bcrypt.compare(password, user.password);
  if (!checking) throw new Error("password xato kiritilgan berilmagan");
  console.log(user.password, checking);
  user.password = password;
  let token = await jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_EXP_TIME }
  );

  console.log(eval(process.env.JWT_REFRESH_EXP_TIME));

  let refreshToken = await jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: eval(process.env.JWT_REFRESH_EXP_TIME) }
  );
  user.refreshToken = refreshToken;
  await user.save();

  let options = {
    maxAge: eval(process.env.JWT_REFRESH_EXP_TIME), // would expire after 15 minutes
    httpOnly: false, // The cookie only accessible by the web server
    // signed: true, // Indicates if the cookie should be signed
  };

  // Set cookie
  res.cookie("jwt", refreshToken, options);
  let userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  resposcha(res, 200, { userObj, token });
});

let getProfile = errorHandler(async (req, res, next) => {
  let user = req.user;

  console.log(user, req.cookies);

  user = await User.findOne({ _id: user.id });

  res.status(200).json({ user });
});

let resetAccesTojenWithRefresh = errorHandler(async (req, res, next) => {
  // console.log();
  let token = req.cookies.jwt;

  let checking = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);

  console.log(checking);

  let user = await User.findOne({ refreshToken: token });
  if (!user || user.id !== checking.id) {
    throw new Error("bunaqa user mavjud emas");
  }

  let accesToken = await jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_EXP_TIME }
  );

  resposcha(res, 200, { token: accesToken });
});
module.exports = {
  registerUser,
  login,
  getProfile,
  resetAccesTojenWithRefresh,
};
