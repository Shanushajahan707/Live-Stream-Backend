import { User, googleUser } from "../entities/User";
import { IUserRepository } from "../providers/interfaces/IUserRepository";
import { UserModel } from "../model/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

export class UserRepository implements IUserRepository {
  private _jwtotp: string | null = null;

  googleFindOne = async (email: string): Promise<googleUser | null> => {
    try {
      const existingUserDocument = await UserModel.findOne({ email: email });

      if (!existingUserDocument) {
        return null;
      }

      const existingUser: googleUser = {
        googleId: existingUserDocument.googleId as unknown as string,
        username: existingUserDocument.username,
        email: existingUserDocument.email,
        _id: existingUserDocument._id,
      };

      return existingUser;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  googleUserCreation = async (data: googleUser): Promise<googleUser> => {
    try {
      const googleuserdata = {
        googleId: data.googleId,
        username: data.username,
        email: data.email,
      };
      const userCreated = await UserModel.create(googleuserdata);
      const googleId = userCreated.googleId as unknown as string;

      const user: googleUser = {
        googleId: googleId,
        username: userCreated.username,
        email: userCreated.email,
        _id: userCreated.id,
      };
      return user;
    } catch (error) {
      console.log("creation");
      console.log("error", error);
      throw error;
    }
  };
  googleFindById = async (id: string): Promise<googleUser | null> => {
    try {
      console.log("here the find by id");
      const existingUserDoc = await UserModel.findById({ _id: id });
      console.log("user from the find by id", existingUserDoc);

      // Check if the document exists
      if (!existingUserDoc) {
        return null;
      }

      // Map the MongoDB document to your googleUser type
      const existingUser: googleUser = {
        googleId: existingUserDoc.googleId as unknown as string,
        username: existingUserDoc.username,
        email: existingUserDoc.email,
        _id: existingUserDoc._id,
      };

      return existingUser;
    } catch (error) {
      console.log("find");
      console.log("err", error);
      throw error;
    }
  };

  isAdmin = async (email: string): Promise<{ isAdmin: boolean }> => {
    const admin = await UserModel.findOne({ email: email });

    if (admin) {
      if (admin.role === "Admin") {
        return { isAdmin: true };
      }
    }

    return { isAdmin: false };
  };

  //checing otp
  otpcheck = async (
    value: number
  ): Promise<{ isValidOTP: boolean; isExpired: boolean }> => {
    try {
      console.log("jwt otp", this._jwtotp);
      const enteredOTPString = Object.values(value).join("");
      console.log("Entered OTP:", parseInt(enteredOTPString));
      console.log("object");
      if (!this._jwtotp) {
        console.error("JWT token not available.");
        return { isValidOTP: false, isExpired: false };
      }

      try {
        const decodedToken = jwt.verify(this._jwtotp, "otpvalue") as {
          otp: string;
          exp: number;
        };
        const storedOTP = decodedToken.otp;
        console.log("Stored OTP:", storedOTP);
        console.log("Stored OTP timeout:", decodedToken.exp);

        const isExpired = Date.now() > decodedToken.exp * 1000;
        console.log("expire data is", isExpired);
        return { isValidOTP: storedOTP == enteredOTPString, isExpired };
      } catch (err) {
        const error = err as Error;
        if (error.name == "TokenExpiredError") {
          console.error("JWT token expired.");
          return { isValidOTP: true, isExpired: true };
        } else {
          console.error("JWT verification error:", error.message);
          throw err;
        }
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  //nodemailer and genrate otp
  sendmail = async (email: string): Promise<string> => {
    try {
      console.log("emal form the repositories is", email);
      console.log("_jwtotp form the repositories is", this._jwtotp);
      const sendOtpEmail = async (
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
                <a href="http://localhost:4200/otp-verification" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Account</a>
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

      const generateRandomString = (length: number): string => {
        const digits = "012345678912";
        let OTP = "";

        for (let i = 0; i < length; i++) {
          const randomIndex = crypto.randomInt(0, digits.length);
          OTP += digits[randomIndex];
        }

        return OTP;
      };

      const otp = parseInt(generateRandomString(6));
      console.log("generated otp is ", otp);
      console.log("exisitng otp form the jwt", this._jwtotp);
      console.log("env value of otp is", process.env.SECRET_OTP);
      this._jwtotp = jwt.sign({ otp }, process.env.SECRET_OTP as string, {
        expiresIn: "1m",
      });
      const mailSent = await sendOtpEmail(email, otp);
      return mailSent;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  //to sign user data using jwt
  jwt = async (payload: User) => {
    try {
      console.log("here the jwt ", payload);
      const plainPayload = {
        _id: payload._id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        password: payload.password,
        dateofbirth: payload.dateofbirth,
        isblocked: payload.isblocked,
      };
      const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string);
      return token;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  //check if the pasword matching
  passwordmatch = async (email: string, password: string) => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        return isPasswordMatch;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  //check if the user existing or not
  findByOne = async (email: string): Promise<User | null> => {
    try {
      const existingUserDocument = await UserModel.findOne({ email: email });
      return existingUserDocument;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
  //insert new user
  create = async (
    username: string,
    email: string,
    password: string,
    dateofbirth: Date,
    isblocked: boolean
  ): Promise<User> => {
    try {
      const user = {
        username: username,
        email: email,
        password: password,
        role: "user",
        dateofbirth: dateofbirth,
        isblocked: isblocked,
      };

      const newuser = await UserModel.create(user);
      console.log(newuser, "created");
      return newuser;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
