const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("../../config/default.json");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../models/Profile");
const User = require("../models/User");
const Post = require("../models/Post");

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

// @route  GET api/profiles
// @desc   Create or update user profile
// @acess  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.owner = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ owner: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { owner: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

// @route  GET api/profiles
// @desc   Create all profiles
// @acess  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("owner", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route  GET api/profiles/user/:user_id
// @desc   Create profile by user ID
// @acess  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      owner: req.params.user_id,
    }).populate("owner", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/profiles
// @desc   Delete profile, user & posts
// @acess  Private
router.delete("/", auth, async (req, res) => {
  try {
    await Post.deleteMany({ owner: req.user.id });
    await Profile.findOneAndRemove({ owner: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route  PUT api/profiles/experience
// @desc   Add profile experience
// @acess  Private
router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ owner: req.user.id });

      profile.experience.unshift(newExperience);

      await profile.save();

      res.json(profile);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

// @route  DELETE api/profiles/experience/:experience_id
// @desc   Delete experience from a profile
// @acess  Private
router.delete("/experience/:experience_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ owner: req.user.id });

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.experience_id);

    if (removeIndex === -1) {
      return res.status(400).json({ msg: "Experience id not valid" });
    }

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route  PUT api/profiles/education
// @desc   Add profile education
// @acess  Private
router.put(
  "/education",
  [
    auth,
    check("school", "School is required").not().isEmpty(),
    check("degree", "Degree is required").not().isEmpty(),
    check("fieldofstudy", "Field of study is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ owner: req.user.id });

      profile.education.unshift(newEducation);

      await profile.save();

      res.json(profile);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

// @route  DELETE api/profiles/education/:education_id
// @desc   Delete education from a profile
// @acess  Private
router.delete("/education/:education_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ owner: req.user.id });

    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.education_id);

    if (removeIndex === -1) {
      return res.status(400).json({ msg: "Education id not valid" });
    }

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route  GET api/profiles/github/:username
// @desc   Get user respositories from a Github user
// @acess  Public
router.get("/github/:username", async (req, res) => {
  try {
    const uri = `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`;

    const githubResponse = await axios.get(uri, {
      headers: {
        "user-agent": "node.js",
      },
      client_id: config.githubClientId,
      client_secret: config.githubSecret,
    });
    res.json(githubResponse.data);
  } catch (err) {
    if (err.response.status === 404) {
      return res.status(404).json({ msg: "No Github profile was Found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
