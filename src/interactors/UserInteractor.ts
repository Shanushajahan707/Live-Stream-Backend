import { User } from "../entities/User";
import { IUserInteractor } from "../providers/interfaces/IUserInteractor";
import { IUserRepository } from "../providers/interfaces/IUserRepository";

export class UserInteractor implements IUserInteractor{

    private repostitory:IUserRepository 

    constructor(repository:IUserRepository) {
        this.repostitory=repository
    }
 async checkotp(value: number): Promise<boolean> {
    return await this.repostitory.otpcheck(value)
  }
 async sendmail(email: string): Promise<string> {
   return await this.repostitory.sendmail(email)
  }
  async  jwt(payload: User): Promise<string> {
        return this.repostitory.jwt(payload)
    }
 async checkpass(email:string,password: string) {
    return this.repostitory.passwordmatch(email,password)
  }

  async  login(email: string):Promise<User | null> {
        return this.repostitory.findByOne(email)
    }
  async  signup(username: string, email: string, password: string, dateofbirth: Date,isblocked:boolean): Promise<User> {
       return this.repostitory.create(username,email,password,dateofbirth,isblocked)
    }

}