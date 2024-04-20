
import { User } from "../entities/User";
import { IUserRepository } from "../providers/interfaces/IUserRepository";
import { UserModel } from "../model/userModel";
import bcrypt from 'bcryptjs'
export class UserRepository implements IUserRepository{

  
async  passwordmatch(email:string,password: string) {
    const user = await UserModel.findOne({ email });
   if(user){
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    return isPasswordMatch
   }
}
   async findByOne(email: string){
    const existingUserDocument = await UserModel.findOne({ email:email });
    return existingUserDocument?true:false
    }
 
   async create(username: string, email: string, password: string, dateofbirth: Date): Promise<User> {
        const user={
            username:username,
            email:email,
            password:password,
            role:'user',
            dateofbirth:dateofbirth
        }
        const newuser = await UserModel.create(user);
        console.log(newuser,'created');
        return newuser
    }
}