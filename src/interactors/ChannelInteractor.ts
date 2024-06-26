import { Channel } from "../entities/Channel";
import { ChannelSubscriptionUser } from "../entities/Subscription";
import { IChannelInteractor } from "../providers/interfaces/IChannelInteractor";
import { IChannelRepository } from "../providers/interfaces/IChannelRepository";
import { uploadS3Video } from "../utils/s3Uploader";

export class channelInteractor implements IChannelInteractor {
  private _repository: IChannelRepository;
  constructor(private repository: IChannelRepository) {
    this._repository = repository;
  }
  fetRevenueChart=async(userid: string): Promise<{ monthlySubscription: { [key: string]: number; } | null;totalAmount: number }> =>{
    try {
      return await this._repository.fetRevenueChart(userid)
    } catch (error) {
      throw error
    }
  }
  getAllSubscribedMembers=async(channelId: string,page:number,limit:number): Promise<{subscribedmembers:ChannelSubscriptionUser[] | null,totalcount:number}> =>{
    try {
      return await this.repository.getAllSubscribedMembers(channelId,page,limit)
    } catch (error) {
      throw error
    }
  }
  subscribeChannel=async(userid: string, channelId: string, planId: string,paymentId:string): Promise<ChannelSubscriptionUser | null> =>{
    try {
      return await this._repository.subscribeChannel(userid,channelId,planId,paymentId)
    } catch (error) {
      throw error
    }
  }
  isChannelMember=async(userId: string,channelId:string): Promise<ChannelSubscriptionUser | null> =>{
    try {
      return await this._repository.isChannelMember(userId,channelId)
    } catch (error) {
      throw error
    }
  }
 
  onSearchChannels=async(query: string,userid:string): Promise<Channel[] | null> =>{
   try {
    return await this._repository.onSearchChannels(query,userid)
   } catch (error) {
    throw error
   }
  }

  updateViews = async (
    channelId: string,
    location: string
  ): Promise<Channel | null> => {
    try {
      return await this.repository.updateViews(channelId, location);
    } catch (error) {
      throw error;
    }
  };
  shortInDb = async (
    channelId: string,
    location: string
  ): Promise<Channel | null> => {
    try {
      return await this._repository.shortInDb(channelId, location);
    } catch (error) {
      throw error;
    }
  };

  uploadShort = async (file: Express.Multer.File): Promise<string> => {
    try {
      const s3bucket = await uploadS3Video(file);
      if ("success" in s3bucket) {
        return s3bucket.success as string;
      } else {
        return "";
      }
    } catch (err) {
      console.error("Error during upload", err);
      throw err;
    }
  };

  getFollowChannel = async (channelId: string): Promise<Channel | null> => {
    try {
      return await this._repository.getFollowChannel(channelId);
    } catch (error) {
      throw error;
    }
  };
  getFullFollowChannels = async (userid: string): Promise<Channel[] | null> => {
    try {
      return await this._repository.getFullFollowChannels(userid);
    } catch (error) {
      throw error;
    }
  };
  unfollowChannel = async (
    userid: string,
    channelData: Channel
  ): Promise<Channel | null> => {
    try {
      return await this.repository.unfollowChannel(userid, channelData);
    } catch (error) {
      throw error;
    }
  };
  isFollow = async (userid: string, channelDate: Channel): Promise<boolean> => {
    try {
      return await this._repository.isFollow(userid, channelDate);
    } catch (error) {
      throw error;
    }
  };
  followChannel = async (
    userid: string,
    channelData: Channel
  ): Promise<Channel | null> => {
    try {
      return await this._repository.followChannel(userid, channelData);
    } catch (error) {
      throw error;
    }
  };
  getRecommededChannel = async (id: string): Promise<Channel[] | null> => {
    try {
      return await this._repository.getRecommededChannel(id);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
  existingChannnel = async (channelName: string): Promise<Channel | null> => {
    try {
      return await this._repository.existingChannnel(channelName);
    } catch (error) {
      throw error;
    }
  };
  editChannel = async (
    _id: string,
    channelName: string,
    filePath: string
  ): Promise<Channel | null> => {
    return await this._repository.editChannel(_id, channelName, filePath);
  };
  async getChannel(id: string): Promise<Channel | null> {
    try {
      return await this._repository.getChannel(id);
    } catch (error) {
      throw error;
    }
  }
}
