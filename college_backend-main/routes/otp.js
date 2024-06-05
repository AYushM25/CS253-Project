const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const { generateOTP, sendOTP } = require('../middleware/otp');

router.post("/generate", async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const otpCode = generateOTP();
      await sendOTP(email, otpCode);
  
      res.json({ success: true, message: 'OTP sent successfully', otp: otpCode });
    } catch (err) {
      console.error('Error generating OTP:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;
