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
import { otpModel } from "../model/otpSession";
import {
  Subscription,
  WebsiteSubscriptionUser,
  channelSubscription,
} from "../entities/Subscription";
import { SubscriptionModel } from "../model/websiteSubscription";
import { channelSubscriptionModel } from "../model/channelSubscription";
import { WebsiteMembershipModel } from "../model/websiteMembership";
import mongoose from "mongoose";
import { AdminWalletModel } from "../model/adminWallet";

dotenv.config();

export class UserRepository implements IUserRepository {
  isTrailOver = async (userId: string): Promise<boolean> => {
    try {
      // Find the channel associated with the user
      const channel = await ChannelModel.findOne({ username: userId });
      if (!channel) {
        throw new Error("Channel not found");
      }

      // Get the current date
      const currentDate = new Date();

      // Compare with the lastDateOfLive in the channel
      return channel.lastDateOfLive < currentDate;
    } catch (error) {
      throw error;
    }
  };
  websiteSubscription = async (
    userId: string,
    planId: string,
    paymentId: string
  ): Promise<WebsiteSubscriptionUser | null> => {
    try {
      console.log(userId, planId, paymentId);

      const plan = await SubscriptionModel.findById(planId);
      if (!plan) {
        throw new Error("Subscription plan not found");
        return null;
      }

      const newMembership = new WebsiteMembershipModel({
        userId,
        subscriptionPlanId: new mongoose.Types.ObjectId(planId),
        paymentId,
        createdAt: new Date(),
      });

      const savedMembership = await newMembership.save();

      // Find the channel
      const user = new mongoose.Types.ObjectId(userId);
      const channel = await ChannelModel.findOne({ username: user });
      if (!channel) {
        throw new Error("Channel not found");
        return null;
      }

      // Update the lastDateOfLive
      const newLastDateOfLive = new Date(channel.lastDateOfLive);
      newLastDateOfLive.setMonth(newLastDateOfLive.getMonth() + plan.month);

      channel.lastDateOfLive = newLastDateOfLive;
      await channel.save();

      const admin = await UserModel.findOne({ role: "Admin" });
      const adminWalletEntry = new AdminWalletModel({
        adminId: admin?._id,
        userId: new mongoose.Types.ObjectId(userId),
        amount: plan.price,
        month: plan.month,
        createdAt: new Date(),
        endsIn: newLastDateOfLive,
      });

      await adminWalletEntry.save();

      return {
        _id: savedMembership._id,
        user: {
          userId: savedMembership.userId,
          subscriptionPlanId: savedMembership.subscriptionPlanId,
          paymentId: savedMembership.paymentId,
        },
        createdAt: savedMembership.createdAt,
      };
    } catch (error) {
      throw error;
    }
  };
  getAllChannelSubscriptionPlan = async (): Promise<
    channelSubscription[] | null
  > => {
    try {
      const channelPlans = await channelSubscriptionModel.find();
      if (channelPlans) {
        return channelPlans;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
  getAllSubscriptionPlan = async (): Promise<Subscription[] | null> => {
    try {
      const plan = await SubscriptionModel.find();
      if (plan) {
        return plan;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  changePass = async (
    email: string,
    password: string
  ): Promise<boolean | null> => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
        await user.save();
        return true;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };
  forgotPassOtpGet = async (email: string): Promise<{ otp: number | null }> => {
    try {
      const otpRecord = await otpModel.findOne({ email });
      if (otpRecord) {
        return { otp: otpRecord.otp };
      }
      return { otp: null };
    } catch (error) {
      throw error;
    }
  };

  forgotPassOtp = async (email: string, otp: number): Promise<boolean> => {
    try {
      const otpRecord = await otpModel.findOne({ email });
      if (otpRecord) {
        otpRecord.otp = otp;
        await otpRecord.save();
      } else {
        const newOtpRecord = new otpModel({ otp, email });
        await newOtpRecord.save();
      }
      return true;
    } catch (error) {
      throw error;
    }
  };

  isUserBlocked = async (userid: string): Promise<boolean> => {
    try {
      if (!userid) {
        return false;
      }
      // console.log(userid, "user id");
      const isUserBlocked = await UserModel.findById(userid);
      // console.log(isUserBlocked);
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
      const lastDateOfLive = new Date();
      lastDateOfLive.setDate(lastDateOfLive.getDate() + 3);

      const channel = {
        username: userCreated._id,
        channelName: `${userCreated.username}'s Channel`,
        followers: [],
        subscription: 0,
        banner: "/images/channel-banner1.png".replace("/images/", ""),
        video: [],
        lastDateOfLive: lastDateOfLive,
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
  otpCheck = async (
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
  sendMail = async (email: string): Promise<string> => {
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
        expiresIn: "1h",
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
        expiresIn: "2d",
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
            console.log("refresh toekn verified");
            return resolve(true);
          }
        });
      });
    } catch (error) {
      throw error;
    }
  };
  generateNewToken = (token: string): Promise<string | null> => {
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
          { expiresIn: "2h" }
        );
        console.log("new token generated repositroy");
        resolve(newAccessToken); // Resolve with the new access token
      });
    });
  };
  //check if the pasword matching
  passwordMatch = async (email: string, password: string) => {
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
      const lastDateOfLive = new Date();
      lastDateOfLive.setDate(lastDateOfLive.getDate() + 3);

      const channel = {
        username: newUser._id,
        channelName: `${username}'s Channel`,
        followers: [],
        subscription: 0,
        banner: "/images/channel-banner1.png".replace("/images/", ""),
        video: [],
        lastDateOfLive: lastDateOfLive,
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
