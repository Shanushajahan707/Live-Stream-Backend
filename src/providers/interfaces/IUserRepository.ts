import { User } from "../../entities/User";


export interface IUserRepository {
    findByOne(email:string):unknown;
    create(username:string,email:string,password:string,dateofbirth:Date):Promise<User>;
    passwordmatch(email:string,password:string): Promise<boolean | undefined>
}