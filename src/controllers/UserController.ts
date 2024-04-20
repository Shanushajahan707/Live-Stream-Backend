import { Response,Request, NextFunction } from "express";
import { IUserInteractor } from "../providers/interfaces/IUserInteractor";
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';

dotenv.config()


export class UserController{

    private interactor:IUserInteractor

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
            const userExist=await this.interactor.login(user.email)  
            if(userExist){
                const check = await this.interactor.checkpass(user.email, user.password); 
                if (!check) {
                    return res.status(400).json({ message: "Password Doesn't Match" }); 
                }    
            }else{
                return res.status(400).json({message:"User not found"})
            }
            console.log('here');
            // const token= jwt.sign({email:user.email,password:user.password},process.env.SECRET)
            res.status(200).json({message:"login succeess"})
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
            const hashedPassword = bcrypt.hashSync(password, 10)
            const user = {
                username,
                email,
                password: hashedPassword, 
                role: 'user',
                dateofbirth:dateofbirth
            };
            if (!username || !email || !password || !dateofbirth) {
                return res.status(400).json({ message: 'Username, email, password and dateofbirth are required' });
            }
            if(!this.isValidEmail(user.email)){
                return res.status(400).json({message:"Invalid email format"})
            } 
            const data=await this.interactor.login(user.email)
            if(data){
               return res.status(400).json({message:"email Already exist"})
            }
            const datas=await this.interactor.signup(user.username,user.email,user.password,user.dateofbirth)
            console.log('inserted');
            return res.status(200).json({message:"the data inserted ",datas})  
        } catch (error) {
            next(error)
        }
    }
     isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
}