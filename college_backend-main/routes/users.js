const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const _ = require("lodash");
const Joi = require("joi");
const { User, validates, validateUser } = require("../models/user");
const College = require("../models/college");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const { valid } = require("joi");
const router = express.Router();

router.post("/register", async (req, res) => {
  // const { error } = validateUser(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  let user1 = await User.findOne({username: req.body.username});
  if(user1) return res.status(400).send("Username not available");
  user = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
    userType: req.body.userType,
    college: req.body.college,
    branch: req.body.branch,
    year: req.body.year,
    AcademicOpinion: req.body.AcademicOpinion,
    NonAcademicOpinion: req.body.NonAcademicOpinion,
    PlacementOpinion: req.body.PlacementOpinion,
    OverallOpinion: req.body.OverallOpinion,
  });
  try {
    await user.save();
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.jwtPrivateKey
    );
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email", "userType", "college", "branch"]));
  } catch (err) {
    console.log("error: ", err);
  }
});

router.put('/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== 'boolean') {
      return res.status(400).send('Invalid request');
    }

    const updatedUser = await User.findByIdAndUpdate(id, { isVerified }, { new: true });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    return res.send(updatedUser);
  } catch (error) {
    console.error('Error updating isVerified status:', error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get("/user-count", async (req, res) => {
  try {
    const collegeSUsers = await User.find({ userType: 'collegeS' });
    const collegeGUsers = await User.find({ userType: 'collegeG' });
    const adminUsers = await User.find({ userType: 'Admin' });

    const collegeSCount = collegeSUsers.length;
    const collegeGCount = collegeGUsers.length;
    const adminCount = adminUsers.length;

    const counts = {
      collegeS: collegeSCount,
      collegeG: collegeGCount,
      admin: adminCount
    };
    res.json(counts);

  } catch (error) {
    console.error("Error getting user counts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/profile/deleteByEmail/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete("/profile/deleteByUsername/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ username });
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  const { college, branch } = req.query;
  try {
    // Find students based on college and branch
    const students = await User.find({ userType: "collegeG", college: college, branch: branch });
    res.json(students);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/compare', async (req, res) => {
  const { college1, college2 } = req.query;

  try {
    const [college1Data, college2Data] = await Promise.all([
      College.findOne({ name: college1 }),
      College.findOne({ name: college2 }),
    ]);

    const data = {
      college1: college1Data || {},
      college2: college2Data || {},
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching college data' });
  }
});

router.get('/opinion', async (req, res) => {
  const { college1, college2, branch1, branch2 } = req.query;
  try {
    const [user1Data, user2Data] = await Promise.all([
      User.find({ userType: "collegeG", college: college1, branch: branch1 }),
      User.find({ userType: "collegeG", college: college2, branch: branch2 }),
    ]);

    const data = {
      user1: user1Data || [],
      user2: user2Data || [],
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error Fetching User Opinions' });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.send("this user does'nt exists in the database!");
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.send("this user does'nt exists in the database!");
  res.send(user);
});

router.post("/login", async (req, res) => {
  // const { error } = validates(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  if (req.user) return res.send("User already logged in!");
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("invalid email or password");

  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.jwtPrivateKey
  );
  res.header("x-auth-token").send(token);
});


router.patch("/profile/updateName/:email", async (req, res) => {
  const { name } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { name: name },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating name:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});


router.patch("/profile/updateUsername/:email", async (req, res) => {
  const { username } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { username: username },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating username:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});


router.patch("/profile/updateEmail/:email", async (req, res) => {
  const { newEmail } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { email: newEmail },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating Email:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});


router.patch("/profile/updateCollege/:email", async (req, res) => {
  const { college } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { college: college },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating College:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});


router.patch("/profile/updateBranch/:email", async (req, res) => {
  const { branch } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { branch: branch },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating Branch:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});


router.patch("/profile/updateYear/:email", async (req, res) => {
  const { year } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { year: year },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating Year:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});
router.patch("/profile/updateAcademicOpinion/:email", async (req, res) => {
  const { AcademicOpinion } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { AcademicOpinion: AcademicOpinion },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating Acadmeic Opinion:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});
router.patch("/profile/updateNonAcademicOpinion/:email", async (req, res) => {
  const { NonAcademicOpinion } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { NonAcademicOpinion: NonAcademicOpinion },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating NOn Academic Opinion:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});
router.patch("/profile/updatePlacementOpinion/:email", async (req, res) => {
  const { PlacementOpinion } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { PlacementOpinion: PlacementOpinion },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating Placement Opinion:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});
router.patch("/profile/updateOverallOpinion/:email", async (req, res) => {
  const { OverallOpinion } = req.body;
  const { email } = req.params;

  User.findOneAndUpdate(
    { email: email },
    { OverallOpinion: OverallOpinion },
    { new: true }
  )
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error('Error updating OverallOpinion:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post("/logout", async (req, res) => { });

router.get("/user-count", async (req, res) => {
  try {
    const collegeSUsers = await User.find({ userType: 'collegeS' });
    const collegeGUsers = await User.find({ userType: 'collegeG' });
    const adminUsers = await User.find({ userType: 'Admin' });

    const collegeSCount = collegeSUsers.length;
    const collegeGCount = collegeGUsers.length;
    const adminCount = adminUsers.length;

    const counts = {
      collegeS: collegeSCount,
      collegeG: collegeGCount,
      admin: adminCount
    };
    res.json(counts);

  } catch (error) {
    console.error("Error getting user counts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/profile/deleteByEmail/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete("/profile/deleteByUsername/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ username });
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
