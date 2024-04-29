import { User } from "../entities/User";
import { UserModel } from "../model/userModel";
import { IAdminRepository } from "../providers/interfaces/IAdminRepository";

export class AdminRepository implements IAdminRepository {
  async blockUser(id: string): Promise<boolean> {
    try {
      const user = await UserModel.findById(id);

      if (!user) {
        return false;
      }

      user.isblocked = !user.isblocked;

      await user.save();

      return true;
    } catch (error) {
      console.error("Error toggling user status:", error);
      return false;
    }
  }

  async getUsers(): Promise<User[] | null> {
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
  }
}
