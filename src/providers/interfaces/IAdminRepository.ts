import { Channel } from "../../entities/Channel";
import { User } from "../../entities/User";

export interface IAdminRepository {
  getUsers(): Promise<User[] | null>;
  blockUser(id: string): Promise<{ update: boolean; user: User | null }>;
  getChannels(): Promise<Channel[] | null>;
  blockChannel(
    id: string
  ): Promise<{ update: boolean; channel: Channel | null }>;
}
