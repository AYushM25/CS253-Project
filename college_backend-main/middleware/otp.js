const nodemailer = require("nodemailer");

const generateOTP = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 6; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
};
  
const sendOTP = async (email, otpCode) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "Outlook365",
            host: "smtp.office365.com",
            port: "587",
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "OTP Verification",
            html: `<p>Your OTP for registration to College Pathfinder is: <strong>${otpCode}</strong></p>`,
        });
        console.log("Email info: ", info);
        return info;
        } catch (error) {
        console.log(error.message);
    }
};

module.exports = { generateOTP, sendOTP };
