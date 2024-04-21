import { User } from "../../entities/User" 

export interface IUserInteractor{
    login(email:string):Promise<User | null>
    signup(username:string,email:string,password:string,dateofbirth:Date,isblocked:boolean):Promise<User>
    checkpass(email:string, password:string):Promise<boolean | undefined>
    jwt(payload:User):Promise<string>
    sendmail(email:string,):Promise<string>
    checkotp(value:number):Promise<boolean>
}