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
  passwordmatch(email: string, password: string): Promise<boolean | undefined>;
  jwt(payload: User): Promise<string>;
  refreshToken(payload: User): Promise<string>;
  sendmail(email: string): Promise<string>;
  otpcheck(value: number): Promise<{ isValidOTP: boolean; isExpired: boolean }>;
  isAdmin(email: string): Promise<{ isAdmin: boolean }>;
  googleFindById(id: string): Promise<googleUser | null>;
  googleFindOne(id: string): Promise<googleUser | null>;
  googleUserCreation(data: googleUser): Promise<googleUser>;
  forgotPassMailSent(email:string):Promise<{isMailSent:string,otp:number}>

}
