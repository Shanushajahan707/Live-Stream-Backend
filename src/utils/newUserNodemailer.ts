import nodemailer from "nodemailer";

export const sendOtpEmail = async (
    email: string,
    otp: number
  ): Promise<string> => {
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
          <div style="font-family: Arial, sans-serif;">
            <p>Dear User,</p>
            <p>Your One-Time Password (OTP) for authentication is:<h1> ${otp} </h1> </p>
            <p>Please click the button below to verify your account:</p>
            <a href="https://capturelive-shanushajahan707s-projects.vercel.app/otp-verification" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Account</a>
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