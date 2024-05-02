import { Response, Request, NextFunction } from "express";
import { IUserInteractor } from "../providers/interfaces/IUserInteractor";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../entities/User";
import { isValidEmail } from "../utils/validEmail";
import { isValidPassword } from "../utils/validPassword";
import { validAge } from "../utils/validAge";

dotenv.config();
//set enum for each reponse message
enum ResponseStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
}

export class UserController {
  private _interactor: IUserInteractor;
  private userdatas!: User;

  //the interactor help to access the user interface repository
  constructor(interactor: IUserInteractor) {
    this._interactor = interactor;
  }

  //logn funcitonalities and call the interactor
  onLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "No User Data Provided" });
      }

      const user = {
        email: req.body.email ? req.body.email.trim() : null,
        password: req.body.password ? req.body.password.trim() : null,
      };

      if (!user.password || !user.email) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "password or email is required" });
      }

      if (!isValidEmail(user.email)) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Invalid email format" });
      }

      const userExist = await this._interactor.login(user.email);

      if (userExist) {
        const check = await this._interactor.checkpass(
          user.email,
          user.password
        );

        if (!check) {
          return res
            .status(ResponseStatus.BadRequest)
            .json({ message: "Password Doesn't Match" });
        }

        const isAdmin = await this._interactor.isAdmin(user.email);

        const userdata = await this._interactor.login(user.email);

        if (userdata) {
          if (userdata.isblocked) {
            return res
              .status(ResponseStatus.BadRequest)
              .json({ message: "Account Blocked" });
          }
          const token = await this._interactor.jwt(userdata);
          return res
            .status(ResponseStatus.Accepted)
            .json({ message: "Sucess Login", token, isAdmin });
        }
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  };

  //signup fucntionalities and call the interactor
  onSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);

      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "No User Data Provided" });
      }

      const { username, email, password, dateofbirth } = req.body;

      if (!username || !email || !password || !dateofbirth) {
        return res.status(ResponseStatus.BadRequest).json({
          message: "Username, email, password and dateofbirth are required",
        });
      }

      if (!isValidEmail(email)) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Invalid email format" });
      }

      if (!isValidPassword(password)) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Invalid password format" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      this.userdatas = {
        username,
        email,
        password: hashedPassword,
        role: "user",
        dateofbirth,
        isblocked: false,
      };

      const data = await this._interactor.login(this.userdatas.email);

      if (data) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "email Already exist" });
      }

      const dob = new Date(dateofbirth);
      const age = validAge(dob);

      if (age < 18) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "You must be at least 18 years old to sign up" });
      }

      const mailsent = await this._interactor.sendmail(this.userdatas.email);
      console.log("sent ", mailsent);

      return res
        .status(ResponseStatus.OK)
        .json({ message: `Check ${this.userdatas.email}` });
    } catch (error) {
      next(error);
    }
  };

  //otp fucntionalities and call the interactor
  onCheckOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Enter the OTP properly" });
      }

      const otpCheckResult = await this._interactor.checkotp(req.body);
      console.log("full otp result", otpCheckResult);
      if (otpCheckResult.isValidOTP) {
        console.log("valid otp controler", otpCheckResult.isValidOTP);
        if (otpCheckResult.isExpired) {
          console.log("is expired controoler", otpCheckResult.isExpired);
          return res
            .status(ResponseStatus.BadRequest)
            .json({ message: "Otp Expired" });
        }
        const insert = await this._interactor.signup(
          this.userdatas.username,
          this.userdatas.email,
          this.userdatas.password,
          this.userdatas.dateofbirth,
          this.userdatas.isblocked
        );
        if (insert) {
          return res
            .status(ResponseStatus.Created)
            .json({ message: "User Data registered" });
        } else {
          return res
            .status(ResponseStatus.BadRequest)
            .json({ message: "Error while inserting user data" });
        }
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Invalid OTP" });
      }
    } catch (error) {
      next(error);
    }
  };

  //resend functionalities and call the interctor
  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body.form: ", req.body.form);
      const userData = req.body.form;
      console.log("mail in backend: ", userData.email);
      const email = userData.email;
      console.log("mail ", email);

      if (email) {
        const mailsent = await this._interactor.sendmail(email);
        if (mailsent) {
          console.log("sent", mailsent);
          return res
            .status(ResponseStatus.OK)
            .json({ message: "Resend Otp successfully" });
        } else {
          return res
            .status(ResponseStatus.BadRequest)
            .json({ message: "Error Creating Otp" });
        }
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error Creating Otp" });
      }
    } catch (error) {
      next(error);
    }
  };
  test = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(
        "user data for mthe test routes extracted by the token",
        req.user
      );
    } catch (error) {
      next(error);
    }
  };

  googleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("user data");
      if (req.user) {
        const message = "Google Authentication Success";
        const user = JSON.stringify(req.user);
        const { googleId, username, email } = JSON.parse(user);

        const token = await this._interactor.googleUserToken(
          googleId,
          username,
          email
        );
        console.log("token", token);
        res.cookie("authResponse", JSON.stringify({ message, user, token }));
       return res.redirect("http://localhost:4200/login");
      }
    } catch (error) {
      next(error);
    }
  };
}
