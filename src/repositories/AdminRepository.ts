import { User } from "../entities/User";
import { UserModel } from "../model/userModel";
import { IAdminRepository } from "../providers/interfaces/IAdminRepository";

export class AdminRepository implements IAdminRepository {

  blockUser = async (id: string):Promise<{update:boolean,user:User|null}> => {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return {update:false,user:null};
      }
      user.isblocked = !user.isblocked;
      await user.save();
      return {update:true,user:user}
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error
    }
  };

  getUsers = async (): Promise<User[] | null> => {
    try {
      const users = await UserModel.aggregate([
        {
          $match: {
            role: { $ne: "Admin" },
          },
        },
      ]);
      return users;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
