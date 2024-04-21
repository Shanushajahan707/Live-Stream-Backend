import { User } from "../../entities/User";


export interface IUserRepository {
    findByOne(email:string):Promise<User | null>
    create(username:string,email:string,password:string,dateofbirth:Date,isblocked:boolean):Promise<User>;
    passwordmatch(email:string,password:string): Promise<boolean | undefined>
    jwt(payload:User):Promise<string>
    sendmail(email:string):Promise<string>
    otpcheck(value:number):Promise<boolean>
}