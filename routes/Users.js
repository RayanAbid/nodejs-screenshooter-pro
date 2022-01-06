const Users = require("../models/Users");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  const userExists = await Users.findOne({ where: { email: email } });
  const userFound = userExists ? true : false;

  if (userFound) {
    res.json({ success: false, message: "User already exists" });
  } else {
    await bcrypt.hash(password, 10).then(async (hash) => {
      const newUser = new Users({
        username: username,
        email: email,
        isPremium: false,
        password: hash,
      });
      const user = await newUser.save();
      const accessToken = sign(
        {
          success: true,
          data: {
            username: user.username,
            isPremium: user.isPremium,
            id: user.id,
            email: user.email,
            isPremium: user.isPremium,
            isStudent: user.isStudent,
            isAdmin: user.isAdmin,
          },
        },
        "importantsecret",
        { expiresIn: 100 }
      );
      res.json({
        success: true,
        data: {
          username: user.username,
          id: user.id,
          email: user.email,
          isPremium: user.isPremium,
          token: accessToken,
        },
      });
    });
  }
});

// login
router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  const user = await Users.findOne({ where: { email: email } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match)
      res.json({
        success: false,
        error: "Wrong Username And Password Combination",
      });

    const accessToken = sign(
      {
        success: true,
        data: {
          username: user.username,
          isPremium: user.isPremium,
          id: user.id,
          email: user.email,
          isPremium: user.isPremium,
          isStudent: user.isStudent,
          isAdmin: user.isAdmin,
        },
      },
      "importantsecret"
      // { expiresIn: 100 }
    );
    res.json({
      success: true,
      data: {
        username: user.username,
        isPremium: user.isPremium,
        id: user.id,
        email: user.email,
        isPremium: user.isPremium,
        isStudent: user.isStudent,
        isAdmin: user.isAdmin,
        token: accessToken,
      },
    });
  });
});

// check auth
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.put("/changepassword", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.updateOne(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
});

module.exports = router;
