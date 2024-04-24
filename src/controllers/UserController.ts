import { Response, Request, NextFunction } from "express";
import { IUserInteractor } from "../providers/interfaces/IUserInteractor";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../entities/User";
import { isValidEmail } from "../utils/validEmail";
import { isValidPassword } from "../utils/validPassword";
import { validAge } from "../utils/validAge";

dotenv.config();

enum ResponseMessage {
  noUserDataProvided = "No User Data Provided",
  emailAndPasswordRequired = "password or email is required",
  invalidEmail = "Invalid email format",
  invalidPassword = "Invalid password format",
  passwordDontMatch = "Password Doesn't Match",
  successlogin = "Sucess Login",
  userNotFound = "User not found",
  singupFieldRequired = "Username, email, password and dateofbirth are required",
  emailExist = "email Already exist",
  validAge="You must be at least 18 years old to sign up.",
  checkOtp = "Enter the OTP properly",
  userDataRegistered = "User Data registered",
  errorWhileInsertion = "Error while inserting user data",
  invalidOtp = "Invalid OTP",
  resendOtpSuccess="Resend Otp successfully" ,
  resendOtpError="Error Creating Otp"
}

export class UserController {
  private interactor: IUserInteractor;
  private userdatas!: User;

  constructor(interactor: IUserInteractor) {
    this.interactor = interactor;
  }

  async onlogin(req: Request, res: Response, next: NextFunction) {
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
      const userExist = await this.interactor.login(user.email);
      if (userExist) {
        const check = await this.interactor.checkpass(
          user.email,
          user.password
        );
        if (!check) {
          return res
            .status(400)
            .json({ message: ResponseMessage.passwordDontMatch });
        }
        const userdata = await this.interactor.login(user.email);
        if (userdata) {
          const token = await this.interactor.jwt(userdata);
          return res
            .status(200)
            .json({ message: ResponseMessage.successlogin, token });
        }
      } else {
        return res.status(400).json({ message: ResponseMessage.userNotFound });
      }
    } catch (error) {
      next(error);
    }
  }
  async onsignup(req: Request, res: Response, next: NextFunction) {
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
        dateofbirth: dateofbirth,
        isblocked: false,
      };
      const data = await this.interactor.login(this.userdatas.email);
      if (data) {
        return res.status(400).json({ message: ResponseMessage.emailExist });
      }
      const dob=new Date(dateofbirth)
      const age=validAge(dob)
      if(age<18){
        return res.status(400).json({message:ResponseMessage.validAge})
      }
      const mailsent = await this.interactor.sendmail(this.userdatas.email);
      console.log("sent ", mailsent);
      return res.status(200).json({ message: `Check ${this.userdatas.email}` });
    } catch (error) {
      next(error);
    }
  }
  async oncheckotp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: ResponseMessage.checkOtp });
      }
      const isValidOTP = await this.interactor.checkotp(req.body);
      if (isValidOTP) {
        const insert = await this.interactor.signup(
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
  async resendotp(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('req.body.form: ',req.body.form)
      const userData = req.body.form
      console.log('mail in backend: ', userData.email)
      const email  = userData.email;
      console.log("mail is", email);
      if (email) {
        const mailsent = await this.interactor.sendmail(email);
        if (mailsent) {
          return res.status(200).json({ message: ResponseMessage.resendOtpSuccess});
        } else {
          return res.status(400).json({ message: ResponseMessage.resendOtpError});
        }
      } else {
        return res.status(400).json({ message: ResponseMessage.resendOtpError});
      }
    } catch (error) {
      next(error);
    }
  }
}
