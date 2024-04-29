import { User, googleUser } from "../../entities/User" 

export interface IUserInteractor{
    login(email:string):Promise<User | null>
    googleLogin():Promise<string>
    signup(username:string,email:string,password:string,dateofbirth:Date,isblocked:boolean):Promise<User>
    checkpass(email:string, password:string):Promise<boolean | undefined>
    jwt(payload:User):Promise<string>
    sendmail(email:string,):Promise<string>
    checkotp(value:number): Promise<{ isValidOTP: boolean; isExpired: boolean }>
    isAdmin(email:string):Promise<{isAdmin:boolean}>
    googleUserToken(googleId:number,username:string,email:string):Promise<string>
    googleFindById(id:string):Promise<googleUser|null>
    googleFindOne(id:string):Promise<googleUser|null>
    googleUserCreation(data:googleUser):Promise<googleUser>
}