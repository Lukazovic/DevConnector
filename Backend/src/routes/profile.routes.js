const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const Profile = require("../models/Profile");
const User = require("../models/User");

// @route  GET api/profiles/me
// @desc   Get current users profile
// @acess  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      owner: req.user.id,
    }).populate("user", ["name, avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
