
import { User } from "../entities/User";
import { IUserRepository } from "../providers/interfaces/IUserRepository";
import { UserModel } from "../model/userModel";
import bcrypt from 'bcryptjs'
import jwt, {  } from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import crypto from 'crypto'


dotenv.config()

export class UserRepository implements IUserRepository{
  private jwtotp:string | null = null


 async otpcheck(value: number): Promise<boolean> {
      const enteredOTPString = Object.values(value).join('');
      console.log('Entered OTP:', parseInt(enteredOTPString));   
       if (!this.jwtotp) {
          console.error('JWT token not available.');
          return false;
      }
        const decodedToken = jwt.verify(this.jwtotp, 'otpvalue') as { otp: string, exp: number }; 
        const storedOTP = decodedToken.otp;
        console.log('Stored OTP:', storedOTP);
        return storedOTP == enteredOTPString

    }
  async  sendmail(email: string): Promise<string> {

    const sendOtpEmail = async (email: string, otp: number): Promise<string> => {
        return new Promise((resolve, reject) => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSCODE
            }
          });
          const mailOptions = {
            from: '',
            to: email,
            subject: 'One-Time Password (OTP) for Authentication',
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
          `
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
        const digits = "0123456789";
        let OTP = "";
  
        for (let i = 0; i < length; i++) {
          const randomIndex = crypto.randomInt(0, digits.length);
          OTP += digits[randomIndex];
        }
  
        return OTP;
      };
  
      const otp = parseInt(generateRandomString(6));
      console.log('generated otp is ',otp);
      this.jwtotp=jwt.sign({otp},'otpvalue',{expiresIn:'1m'})
      const mailSent = await sendOtpEmail(email, otp);
      return mailSent;
    }
  

  async  jwt(payload: User) {
    console.log('here the jwt ',payload);
    const plainPayload = {
        _id: payload._id,
        username: payload.username,
        email: payload.email,
       role:payload.role,
       password:payload.password,
       dateofbirth:payload.dateofbirth,
       isblocked:payload.isblocked
    };
        const token=jwt.sign(plainPayload,'loginsecret')
        return token
    }
async  passwordmatch(email:string,password: string) {
    const user = await UserModel.findOne({ email });
   if(user){
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    return isPasswordMatch
   }
}
   async findByOne(email: string):Promise<User | null>{
    const existingUserDocument = await UserModel.findOne({ email:email });
    return existingUserDocument
    }
 
   async create(username: string, email: string, password: string, dateofbirth: Date,isblocked:boolean): Promise<User> {
        const user={
            username:username,
            email:email,
            password:password,
            role:'user',
            dateofbirth:dateofbirth,
            isblocked:isblocked
        }
        const newuser = await UserModel.create(user);
        console.log(newuser,'created');
        return newuser
    }
}