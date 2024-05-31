import { Channel } from "../../entities/Channel";
import { User } from "../../entities/User";

export interface IAdminInteractor {
  getUsers(page: number, limit: number): Promise<{users:User[] | null,totalCount:number}>;
  blockUser(id: string): Promise<{ update: boolean; user: User | null }>;
  getChannels(page:number,limit:number): Promise<{allChannels:Channel[] | null,totalcount:number}>;
  blockChannel(
    id: string
  ): Promise<{ update: boolean; channel: Channel | null }>;
  getUserOne(userId:string):Promise<User|null>
}
