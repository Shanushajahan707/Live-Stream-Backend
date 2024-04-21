import { Response,Request, NextFunction } from "express";
import { IUserInteractor } from "../providers/interfaces/IUserInteractor";
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';
import { User } from "../entities/User";


dotenv.config()


export class UserController{

    private interactor:IUserInteractor
    private userdatas!:User

    constructor(interactor:IUserInteractor){
        this.interactor=interactor
    }

    async onlogin(req:Request,res:Response,next:NextFunction){
        try {
            console.log(req.body);
            if (!req.body) {
                return res.status(400).json({ message: 'No user data provided' });
            } 
            const user = {
                email: req.body.email ? req.body.email.trim() : null,
                password: req.body.password ? req.body.password.trim() : null,
            };
            if (!user.password || !user.email) {
                return res.status(400).json({ message: 'password or email is required' });
            }
            if(!this.isValidEmail(user.email)){
                return res.status(400).json({message:"Invalid email format"})
            }      
            const userExist = await this.interactor.login(user.email);
            console.log('values of the user exist', userExist);
            
            if (userExist) {
                const check = await this.interactor.checkpass(user.email, user.password);
                if (!check) {
                    return res.status(400).json({ message: "Password Doesn't Match" });
                }
                const userdata = await this.interactor.login(user.email);
                if(userdata){
                    const token = await this.interactor.jwt(userdata);
                    return res.status(200).json({ message: "login success", token });
                }
            } else {
                return res.status(400).json({ message: "User not found" });
            }
        } catch (error) {
            next(error)
        }
    }
    async onsignup(req:Request,res:Response,next:NextFunction){
        try {
            console.log(req.body);
            if (!req.body) {
                return res.status(400).json({ message: 'No user data provided' });
            }
            const {username,email,password,dateofbirth}=req.body
            if (!username || !email || !password || !dateofbirth) {
                return res.status(400).json({ message: 'Username, email, password and dateofbirth are required' });
            }
            const hashedPassword = bcrypt.hashSync(password, 10)
           this.userdatas= {
                username,
                email,
                password: hashedPassword, 
                role: 'user',
                dateofbirth:dateofbirth,
                isblocked:false
            };
            if(!this.isValidEmail(this.userdatas.email)){
                return res.status(400).json({message:"Invalid email format"})
            } 
            const data=await this.interactor.login(this.userdatas.email)
            if(data){
               return res.status(400).json({message:"email Already exist"})
            }
            const mailsent=await this.interactor.sendmail(this.userdatas.email)
            console.log('sent ',mailsent);
            return res.status(200).json({message:`Check ${this.userdatas.email} this mail`})  
        } catch (error) {
            next(error)
        }
    }
     isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    async oncheckotp(req:Request,res:Response,next:NextFunction){
        try {
            if (!req.body) {
                return res.status(400).json({ message: "Enter the OTP properly" });
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
                    return res.status(201).json({ message: "User Data registered" });
                } else {
                    return res.status(400).json({ message: "Error while inserting user data" });
                }
            } else {
                return res.status(400).json({ message: "Invalid OTP" });
            }
        } catch (error) {
            next(error);
        }
    } 
    async resendotp(req:Request,res:Response,next:NextFunction){
        try {
            // const email=this.userdatas.email
            // console.log('mail is',this.userdatas.email);
           if(false){
            // const mailsent=await this.interactor.sendmail(email)
            if(false){
              return  res.status(200).json({message:"Resend Otp successfully"})
            }else{
                return  res.status(400).json({message:"Fail to generate otp"})
            }
           }else{
            return  res.status(400).json({message:"Fail to generate otp"})
           }
        } catch (error) {
            next(error)
        }
    }
}