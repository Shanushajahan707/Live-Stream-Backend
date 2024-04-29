import { User } from "../../entities/User";

export interface IAdminInteractor{
    getUsers():Promise<User[] | null>
    blockUser(id:string):Promise<boolean>
}