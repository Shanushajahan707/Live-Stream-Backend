import { User } from "../../entities/User" 

export interface IUserInteractor{
    login(email:string):unknown
    signup(username:string,email:string,password:string,dateofbirth:Date):Promise<User>
    checkpass(email:string, password:string):Promise<boolean | undefined>
}