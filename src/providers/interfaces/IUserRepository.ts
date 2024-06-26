import { Subscription, WebsiteSubscriptionUser, channelSubscription } from "../../entities/Subscription";
import { User, googleUser } from "../../entities/User";

export interface IUserRepository {
  findByOne(email: string): Promise<User | null>;
  create(
    username: string,
    email: string,
    password: string,
    dateofbirth: Date,
    isblocked: boolean
  ): Promise<User>;
  passwordMatch(email: string, password: string): Promise<boolean | undefined>;
  jwt(payload: User): Promise<string>;
  refreshToken(payload: User): Promise<string>;
  verifyRefreshToken(token:string): Promise<boolean>;
  generateNewToken(token:string): Promise<string|null>;
  sendMail(email: string): Promise<string>;
  otpCheck(value: number): Promise<{ isValidOTP: boolean; isExpired: boolean }>;
  isAdmin(email: string): Promise<{ isAdmin: boolean }>;
  googleFindById(id: string): Promise<googleUser | null>;
  googleFindOne(id: string): Promise<googleUser | null>;
  googleUserCreation(data: googleUser): Promise<googleUser>;
  forgotPassMailSent(email:string):Promise<{isMailSent:string,otp:number}>
  forgotPassOtp(email:string,otp:number):Promise<boolean>
  forgotPassOtpGet(email:string):Promise<{otp:number|null}>
  changePass(email:string,password:string):Promise<boolean|null>
  isUserBlocked(userid:string):Promise<boolean>
  getAllSubscriptionPlan():Promise<Subscription[]|null>
  getAllChannelSubscriptionPlan():Promise<channelSubscription[]|null>
  websiteSubscription(userid: string,planId: string,paymentId: string):Promise<WebsiteSubscriptionUser|null>
  isTrailOver(userid:string):Promise<boolean>

}
