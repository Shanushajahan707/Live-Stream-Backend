import { User } from "../entities/User";
import { IUserInteractor } from "../providers/interfaces/IUserInteractor";
import { IUserRepository } from "../providers/interfaces/IUserRepository";

export class UserInteractor implements IUserInteractor{

    private repostitory:IUserRepository 

    constructor(repository:IUserRepository) {
        this.repostitory=repository
    }
 async checkpass(email:string,password: string) {
    return this.repostitory.passwordmatch(email,password)
  }

  async  login(email: string) {
        return this.repostitory.findByOne(email)
    }
  async  signup(username: string, email: string, password: string, dateofbirth: Date): Promise<User> {
       return this.repostitory.create(username,email,password,dateofbirth)
    }

}