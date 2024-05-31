import nodemailer from "nodemailer";

export const sendOtpEmailForForgotPass = async (email: string,otp:number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSCODE,
      },
    });
    const mailOptions = {
      from: "",
      to: email,
      subject: "One-Time Password (OTP) for Authentication",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <p>Dear User,</p>
            <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
            <p style="font-size: 24px; font-weight: bold; text-align: center;">${otp}</p>
            <p>Then, click the button below to reset your password:</p>
            <a href="http://localhost:4200/forgot-password" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; text-align: center;">Reset Password</a>
            <div style="margin-top: 20px;">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT38GdlfKO3i3cHMzxTvbK_ALOzkeiPpY7IgA&s" alt="Your Project Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
            </div>
          </div>
          
          `,
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};
