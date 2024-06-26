import { Channel } from "../entities/Channel";
import { AdminWalletDocument, Subscription, channelSubscription } from "../entities/Subscription";
import { User } from "../entities/User";
import { IAdminInteractor } from "../providers/interfaces/IAdminInteractor";
import { IAdminRepository } from "../providers/interfaces/IAdminRepository";

export class AdminInteractor implements IAdminInteractor {
  private _repository: IAdminRepository;

  constructor(repository: IAdminRepository) {
    this._repository = repository;
  }
  fetchDashboardData=async(): Promise<{monthlySubscription: { [key: string]: number } | null}> =>{
    try {
      return await this._repository.fetchDashboardData()
    } catch (error) {
      throw error
    }
  }
  fetchMembership=async(): Promise<{member:AdminWalletDocument[]|null,wallet:number}> =>{
    try {
      return await this._repository.fetchMembership()
    } catch (error) {
      throw error
    }
  }
  getAllChannelPlan=async(): Promise<channelSubscription[] | null> =>{
    try {
          return await this._repository.getAllChannelPlan()
        } catch (error) {
          throw error
        }
  }

  addChannelSubscription=async(data: channelSubscription): Promise<channelSubscription | null> =>{
    try {
      return await this._repository.addChannelSubscription(data)
    } catch (error) {
      throw error
    }
  }
  getAllPlan=async(): Promise<Subscription[] | null>=> {
    try {
      return await this._repository.getAllPlan()
    } catch (error) {
      throw error
    }
  }
  insertSubscription=async(data: Subscription): Promise<Subscription | null> =>{
    try {
      return await this._repository.insertSubscription(data)
    } catch (error) {
      throw error
    }
  }

  getChannelsCount=async(): Promise<number | null> =>{
    try {
      return await this._repository.getChannelsCount()
    } catch (error) {
      throw error
    }
  }
  getUsersCount=async(): Promise<number | null> =>{
    try {
      return await this._repository.getUsersCount()
    } catch (error) {
     throw error 
    }
  }
  getUserOne=async(userId: string): Promise<User | null> =>{
    try {
      return await this._repository.getUserOne(userId)
    } catch (error) {
      throw error
    }
  }
  blockChannel = async (
    id: string
  ): Promise<{ update: boolean; channel: Channel | null }> => {
    return await this._repository.blockChannel(id);
  };
  getChannels = async (page:number,limit:number): Promise<{allChannels:Channel[] | null,totalcount:number}> => {
    try {
      return await this._repository.getChannels(page,limit);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  blockUser = async (
    id: string
  ): Promise<{ update: boolean; user: User | null }> => {
    try {
      return await this._repository.blockUser(id);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  getUsers = async (page: number, limit: number): Promise<{users:User[] | null,totalCount:number}> => {
    try {
      return await this._repository.getUsers(page,limit);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
