import { User, googleUser } from "../entities/User";
import { IUserInteractor } from "../providers/interfaces/IUserInteractor";
import { IUserRepository } from "../providers/interfaces/IUserRepository";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class UserInteractor implements IUserInteractor {
  private _repostitory: IUserRepository;

  //_repostitory help to connect the iuser repository
  constructor(repository: IUserRepository) {
    this._repostitory = repository;
  }
  async googleFindOne(email: string): Promise<googleUser | null> {
    try {
       const existingUserDoc = await this._repostitory.findByOne(email);
   
       // Check if the document exists
       if (!existingUserDoc) {
         return null;
       }
   
       // Map the MongoDB document to your googleUser type
       const existingUser: googleUser = {
         googleId: existingUserDoc.googleId as unknown as string,
         username: existingUserDoc.username,
         email: existingUserDoc.email,
        _id:existingUserDoc._id
           };
   
       return existingUser;
    } catch (error) {
       console.log("error", error);
       throw error;
    }
   }
   
   
  async googleUserCreation(data: googleUser): Promise<googleUser> {
    try {
      return await this._repostitory.googleUserCreation(data);
    } catch (error) {
      console.log("eror", error);
      throw error;
    }
  }
  async googleFindById(id: string): Promise<googleUser | null> {
    try {
      return await this._repostitory.googleFindById(id);
    } catch (error) {
        console.log('here');
      console.log("eror", error);
      throw error;
    }
  }

  async googleUserToken(
    googleId: number,
    username: string,
    email: string
  ): Promise<string> {
    try {
      const gUser = {
        googleId,
        username,
        email,
      };
      const token = jwt.sign(gUser, process.env.SECRET_LOGIN as string);
      return token;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async googleLogin(): Promise<string> {
    try {
      return this._repostitory.googleLogin();
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
  async isAdmin(email: string): Promise<{ isAdmin: boolean }> {
    try {
      return this._repostitory.isAdmin(email);
    } catch (error) {
      console.log("error to check isadmin");
      throw error;
    }
  }
  // this  method return the another method from the repositry
  async checkotp(
    value: number
  ): Promise<{ isValidOTP: boolean; isExpired: boolean }> {
    try {
      return await this._repostitory.otpcheck(value);
    } catch (error) {
      console.error("Error in checkotp:", error);
      throw error;
    }
  }
  // this  method return if the mail sent or not
  async sendmail(email: string): Promise<string> {
    try {
      return await this._repostitory.sendmail(email);
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  }
  // this  method return to sign the jwt token
  async jwt(payload: User): Promise<string> {
    try {
      return await this._repostitory.jwt(payload);
    } catch (error) {
      console.error("Error in jwt:", error);
      throw error;
    }
  }
  // return the matching password
  async checkpass(email: string, password: string) {
    try {
      return await this._repostitory.passwordmatch(email, password);
    } catch (error) {
      console.error("Error in checkpass:", error);
      throw error;
    }
  }
  //return user exist in db
  async login(email: string): Promise<User | null> {
    try {
      return await this._repostitory.findByOne(email);
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  }
  //return if the user inserted
  async signup(
    username: string,
    email: string,
    password: string,
    dateofbirth: Date,
    isblocked: boolean
  ): Promise<User> {
    try {
      return await this._repostitory.create(
        username,
        email,
        password,
        dateofbirth,
        isblocked
      );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  }
}
