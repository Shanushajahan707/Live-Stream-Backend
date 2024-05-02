import { User } from "../../entities/User";

export interface IAdminRepository {
  getUsers(): Promise<User[] | null>;
  blockUser(id: string): Promise<{update:boolean,user:User|null}>;
}
