import { User, googleUser } from "../entities/User";
import { IUserRepository } from "../providers/interfaces/IUserRepository";
import { UserModel } from "../model/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ChannelModel } from "../model/channelModel";
import { generateRandomString } from "../utils/generateOtp";
import { sendOtpEmail } from "../utils/newUserNodemailer";
import { sendOtpEmailForForgotPass } from "../utils/forgotPassNodemailer";

dotenv.config();

export class UserRepository implements IUserRepository {


  isUserBlocked = async (userid: string): Promise<boolean> => {
    try {
      if (!userid) {
        return false;
      }
      console.log(userid,'user id');
      const isUserBlocked = await UserModel.findById(userid);
      console.log(isUserBlocked);
      if (isUserBlocked?.isblocked) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };
  private _jwtotp: string | null = null;

  forgotPassMailSent = async (
    email: string
  ): Promise<{ isMailSent: string; otp: number }> => {
    try {
      console.log("email is", email);
      const generateRandomFourDigitNumber = (): number => {
        const min = 1000;
        const max = 9999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      const otp = generateRandomFourDigitNumber();

      const isMailSent = await sendOtpEmailForForgotPass(email, otp);

      return { isMailSent: isMailSent, otp: otp };
    } catch (error) {
      throw error;
    }
  };

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
        dateofbirth: existingUserDocument.dateofbirth ?? new Date(),
        role: existingUserDocument.role,
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
        dateofbirth: data.dateofbirth,
      };
      const userCreated = await UserModel.create(googleuserdata);
      const googleId = userCreated.googleId as unknown as string;

      const user: googleUser = {
        googleId: googleId,
        username: userCreated.username,
        email: userCreated.email,
        dateofbirth: data.dateofbirth ?? new Date(),
        role: userCreated.role,
        _id: userCreated.id,
      };
      const channel = {
        username: userCreated._id,
        channelName: `${userCreated.username}'s Channel`,
        followers: [],
        subscription: 0,
        banner: "/images/channel-banner1.png".replace("/images/", ""),
        video: [],
        lives: [],
      };

      await ChannelModel.create(channel)
        .then((ok) => {
          console.log("ok channel created", ok);
        })
        .catch((error) => {
          console.log("fail to crate", error);
        });
      // console.log(newChannel, "created");
      return user;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
  googleFindById = async (id: string): Promise<googleUser | null> => {
    try {
      const existingUserDoc = await UserModel.findById({ _id: id });
      // console.log("user from the find by id", existingUserDoc);

      // Check if the document exists
      if (!existingUserDoc) {
        return null;
      }

      // Map the MongoDB document to your googleUser type
      const existingUser: googleUser = {
        googleId: existingUserDoc.googleId as unknown as string,
        username: existingUserDoc.username,
        email: existingUserDoc.email,
        dateofbirth: existingUserDoc.dateofbirth ?? new Date(), // Provide a default value
        role: existingUserDoc.role,
        _id: existingUserDoc._id,
      };

      return existingUser;
    } catch (error) {
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
      // console.log("jwt otp", this._jwtotp);
      const enteredOTPString = Object.values(value).join("");
      // console.log("Entered OTP:", parseInt(enteredOTPString));
      // console.log("object");
      if (!this._jwtotp) {
        // console.error("JWT token not available.");
        return { isValidOTP: false, isExpired: false };
      }

      try {
        const decodedToken = jwt.verify(this._jwtotp, "otpvalue") as {
          otp: string;
          exp: number;
        };
        const storedOTP = decodedToken.otp;
        // console.log("Stored OTP:", storedOTP);
        // console.log("Stored OTP timeout:", decodedToken.exp);

        const isExpired = Date.now() > decodedToken.exp * 1000;
        // console.log("expire data is", isExpired);
        return { isValidOTP: storedOTP == enteredOTPString, isExpired };
      } catch (err) {
        const error = err as Error;
        if (error.name == "TokenExpiredError") {
          // console.error("JWT token expired.");
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
      // console.log("emal form the repositories is", email);
      // console.log("_jwtotp form the repositories is", this._jwtotp);

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
      // console.log("here the jwt ", payload);
      const plainPayload = {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        dateofbirth: payload.dateofbirth,
        isblocked: payload.isblocked,
        _id: payload._id,
      };
      // console.log("payload is", plainPayload);
      const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string, {
        expiresIn: "2h",
      });
      return token;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
  refreshToken = async (payload: User) => {
    try {
      // console.log("here the jwt ", payload);
      const plainPayload = {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        dateofbirth: payload.dateofbirth,
        isblocked: payload.isblocked,
        _id: payload._id,
      };
      // console.log("payload is", plainPayload);
      const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string, {
        expiresIn: "10d",
      });
      return token;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  verifyRefreshToken = async (token: string): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        jwt.verify(token, process.env.SECRET_LOGIN as string, (err, user) => {
          if (err) {
            return resolve(false); 
          }
          if (user) {
            console.log('refresh toekn verified');
            return resolve(true);
          }
        });
      });
    } catch (error) {
      throw error;
    }
  };
  generatenewtoken = (token: string): Promise<string | null> => {
    return new Promise((resolve) => {
      jwt.verify(token, process.env.SECRET_LOGIN as string, (err, decoded) => {
        if (err || !decoded) {
          return resolve(null); 
        }
  
        const user = decoded as User;

        // Define the payload to be signed
        const plainPayload = {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          dateofbirth: user.dateofbirth,
          isblocked: user.isblocked,
          _id: user._id,
        };
  
        // Create a new access token with the plainPayload
        const newAccessToken = jwt.sign(
          plainPayload,
          process.env.SECRET_LOGIN as string,
          { expiresIn: '2h' }
        );
        console.log('new token generated repositroy');
        resolve(newAccessToken); // Resolve with the new access token
      });
    });
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
      // console.log("exisitng user is", existingUserDocument);
      if (!existingUserDocument) {
        return null;
      }
      const user = new User(
        existingUserDocument.username,
        existingUserDocument.email,
        existingUserDocument.password,
        existingUserDocument.role,
        existingUserDocument.dateofbirth ?? new Date("2002-10-29"),
        existingUserDocument.isblocked,
        undefined,
        existingUserDocument._id
      );
      // console.log("usr from the findbyone in repo", user);
      return user;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

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

      const newUser = await UserModel.create(user);
      // console.log(newUser, "created");

      const channel = {
        username: newUser._id,
        channelName: `${username}'s Channel`,
        followers: [],
        subscription: 0,
        banner: "/images/channel-banner1.png".replace("/images/", ""),
        video: [],
        lives: [],
      };

      const newChannel = await ChannelModel.create(channel)
        .then((ok) => {
          console.log("ok channel created", ok);
        })
        .catch((error) => {
          console.log("fail to crate", error);
        });
      console.log(newChannel, "created");

      const newUserInstance = new User(
        newUser.username,
        newUser.email,
        newUser.password,
        newUser.role,
        newUser.dateofbirth ?? new Date("2002-10-29"),
        newUser.isblocked,
        newUser._id
      );

      return newUserInstance;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
