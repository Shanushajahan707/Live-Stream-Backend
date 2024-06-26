import { Subscription, WebsiteSubscriptionUser, channelSubscription } from "../../entities/Subscription";
import { User, googleUser } from "../../entities/User";

export interface IUserInteractor {
  login(email: string): Promise<User | null>;
  signup(
    username: string,
    email: string,
    password: string,
    dateofbirth: Date,
    isblocked: boolean
  ): Promise<User>;
  checkPass(email: string, password: string): Promise<boolean | undefined>;
  jwt(payload: User): Promise<string>;
  refreshToken(payload: User): Promise<string>;
  verifyRefreshToken(token: string): Promise<boolean>;
  generateNewToken(token: string): Promise<string | null>;
  sendMail(email: string): Promise<string>;
  checkOtp(value: number): Promise<{ isValidOTP: boolean; isExpired: boolean }>;
  isAdmin(email: string): Promise<{ isAdmin: boolean }>;
  googleUserToken(
    googleId: number,
    username: string,
    email: string,
    role: string,
    _id: string
  ): Promise<string>;
  googleFindById(id: string): Promise<googleUser | null>;
  googleFindOne(id: string): Promise<googleUser | null>;
  googleUserCreation(data: googleUser): Promise<googleUser>;
  forgotPassMailSent(
    email: string
  ): Promise<{ isMailSent: string; otp: number }>;
  forgotPassOtp(email: string, otp: number): Promise<boolean>;
  forgotPassOtpGet(email: string): Promise<{ otp: number | null }>;
  // checkOldPass(email:string,password:string):Promise<boolean>
  changePass(email: string, password: string): Promise<boolean | null>;
  isUserBlocked(userid: string): Promise<boolean>;
  getAllSubscriptionPlan(): Promise<Subscription[] | null>;
  getAllChannelSubscriptionPlan(): Promise<channelSubscription[] | null>;
  websiteSubscription(userid: string,planId: string,paymentId: string):Promise<WebsiteSubscriptionUser|null>
  isTrailOver(userid:string):Promise<boolean>
  
}
