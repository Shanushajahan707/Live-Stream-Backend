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
enum ResponseMessage {
  noUserDataProvided = "No User Data Provided",
  emailAndPasswordRequired = "password or email is required",
  invalidEmail = "Invalid email format",
  invalidPassword = "Invalid password format",
  passwordDontMatch = "Password Doesn't Match",
  successlogin = "Sucess Login",
  accountBlocked = "Account Blocked",
  userNotFound = "User not found",
  singupFieldRequired = "Username, email, password and dateofbirth are required",
  emailExist = "email Already exist",
  validAge = "You must be at least 18 years old to sign up.",
  checkOtp = "Enter the OTP properly",
  userDataRegistered = "User Data registered",
  errorWhileInsertion = "Error while inserting user data",
  invalidOtp = "Invalid OTP",
  otpExpired = "Otp Expired",
  resendOtpSuccess = "Resend Otp successfully",
  resendOtpError = "Error Creating Otp",
}

export class UserController {
  private _interactor: IUserInteractor;
  private userdatas!: User;

  //the interactor help to access the user interface repository
  constructor(interactor: IUserInteractor) {
    this._interactor = interactor;
  }

  //logn funcitonalities and call the interactor
  async onLogin(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      if (!req.body) {
        return res
          .status(400)
          .json({ message: ResponseMessage.noUserDataProvided });
      }

      const user = {
        email: req.body.email ? req.body.email.trim() : null,
        password: req.body.password ? req.body.password.trim() : null,
      };

      if (!user.password || !user.email) {
        return res
          .status(400)
          .json({ message: ResponseMessage.emailAndPasswordRequired });
      }

      if (!isValidEmail(user.email)) {
        return res.status(400).json({ message: ResponseMessage.invalidEmail });
      }

      const userExist = await this._interactor.login(user.email);

      if (userExist) {
        const check = await this._interactor.checkpass(
          user.email,
          user.password
        );

        if (!check) {
          return res
            .status(400)
            .json({ message: ResponseMessage.passwordDontMatch });
        }

        const isAdmin = await this._interactor.isAdmin(user.email);

        const userdata = await this._interactor.login(user.email);

        if (userdata) {
          if (userdata.isblocked) {
            return res
              .status(400)
              .json({ message: ResponseMessage.accountBlocked });
          }
          const token = await this._interactor.jwt(userdata);
          return res
            .status(200)
            .json({ message: ResponseMessage.successlogin, token, isAdmin });
        }
      } else {
        return res.status(400).json({ message: ResponseMessage.userNotFound });
      }
    } catch (error) {
      next(error);
    }
  }

  //signup fucntionalities and call the interactor
  async onSignup(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);

      if (!req.body) {
        return res
          .status(400)
          .json({ message: ResponseMessage.noUserDataProvided });
      }

      const { username, email, password, dateofbirth } = req.body;

      if (!username || !email || !password || !dateofbirth) {
        return res
          .status(400)
          .json({ message: ResponseMessage.singupFieldRequired });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: ResponseMessage.invalidEmail });
      }

      if (!isValidPassword(password)) {
        return res
          .status(400)
          .json({ message: ResponseMessage.invalidPassword });
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
        return res.status(400).json({ message: ResponseMessage.emailExist });
      }

      const dob = new Date(dateofbirth);
      const age = validAge(dob);

      if (age < 18) {
        return res.status(400).json({ message: ResponseMessage.validAge });
      }

      const mailsent = await this._interactor.sendmail(this.userdatas.email);
      console.log("sent ", mailsent);

      return res.status(200).json({ message: `Check ${this.userdatas.email}` });
    } catch (error) {
      next(error);
    }
  }

  //otp fucntionalities and call the interactor
  async onCheckOtp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: ResponseMessage.checkOtp });
      }

      const otpCheckResult = await this._interactor.checkotp(req.body);
      console.log("full otp result", otpCheckResult);
      if (otpCheckResult.isValidOTP) {
        console.log("valid otp controler", otpCheckResult.isValidOTP);
        if (otpCheckResult.isExpired) {
          console.log("is expired controoler", otpCheckResult.isExpired);
          return res.status(400).json({ message: ResponseMessage.otpExpired });
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
            .status(201)
            .json({ message: ResponseMessage.userDataRegistered });
        } else {
          return res
            .status(400)
            .json({ message: ResponseMessage.errorWhileInsertion });
        }
      } else {
        return res.status(400).json({ message: ResponseMessage.invalidOtp });
      }
    } catch (error) {
      next(error);
    }
  }

  //resend functionalities and call the interctor
  async resendOtp(req: Request, res: Response, next: NextFunction) {
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
            .status(200)
            .json({ message: ResponseMessage.resendOtpSuccess });
        } else {
          return res
            .status(400)
            .json({ message: ResponseMessage.resendOtpError });
        }
      } else {
        return res
          .status(400)
          .json({ message: ResponseMessage.resendOtpError });
      }
    } catch (error) {
      next(error);
    }
  }
  async test(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "user data for mthe test routes extracted by the token",
        req.user
      );
    } catch (error) {
      next(error);
    }
  }

    async googleCallback(req: Request, res: Response, next: NextFunction){
      try {
        console.log('user data');
        if(req.user){
          const message="Google Authentication Success";
          const user=JSON.stringify(req.user)
          const { googleId, username, email } = JSON.parse(user);
          
          const token=await this._interactor.googleUserToken(googleId,username,email)
          console.log('token',token);
          res.cookie('authResponse',JSON.stringify({message,user,token}))
          res.redirect('http://localhost:4200/login')
        }
      } catch (error) {
        next(error)
      }
    }

  async googleUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const googleuser = await this._interactor.googleLogin();
      console.log("inserted", googleuser);
    } catch (error) {
      next(error);
    }
  }
  
}
