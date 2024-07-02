import { Channel } from "../../entities/Channel";
import { AdminWalletDocument, Subscription, channelSubscription } from "../../entities/Subscription";
import { User } from "../../entities/User";

export interface IAdminRepository {
  getUsers(page: number, limit: number): Promise<{users:User[] | null,totalCount:number}>;
  blockUser(id: string): Promise<{ update: boolean; user: User | null }>;
  getChannels(page:number,limit:number): Promise<{allChannels:Channel[] | null,totalcount:number}>;
  blockChannel(
    id: string
  ): Promise<{ update: boolean; channel: Channel | null }>;
  getUserOne(userId:string):Promise<User|null>
  getUsersCount():Promise<number|null>
  getChannelsCount():Promise<number|null>
  insertSubscription(data:Subscription):Promise<Subscription|null>
  getAllPlan():Promise<Subscription[]|null>
  addChannelSubscription(data:channelSubscription):Promise<channelSubscription|null>
  getAllChannelPlan():Promise<channelSubscription[]|null>
  fetchMembership():Promise<{member:AdminWalletDocument[]|null,wallet:number}>
  fetchDashboardData():Promise<{monthlySubscription: { [key: string]: number } | null,individualPlanSubscriptions:  {[key: string]: { [key: string]: number }}}>

}
