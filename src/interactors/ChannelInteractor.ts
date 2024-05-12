import { Channel } from "../entities/Channel";
import { IChannelInteractor } from "../providers/interfaces/IChannelInteractor";
import { IChannelRepository } from "../providers/interfaces/IChannelRepository";

export class channelInteractor implements IChannelInteractor {

  private _repository: IChannelRepository;
  constructor(private repository: IChannelRepository) {
    this._repository = repository;
  }
  unfollowChannel=async(userid: string, channelData: Channel): Promise<Channel | null> =>{
      try {
        return this.repository.unfollowChannel(userid,channelData)
      } catch (error) {
        throw error
      }
  }
  isFollow=async(userid: string, channelDate: Channel): Promise<boolean> =>{
      try {
        return this._repository.isFollow(userid,channelDate)
      } catch (error) {
        throw error
      }
  }
  followChannel=async(userid: string, channelData: Channel): Promise<Channel | null> =>{
      try {
        return this._repository.followChannel(userid,channelData)
      } catch (error) {
        throw error
      }
  }
  getRecommededChannel = async (id:string): Promise<Channel[] | null> => {
    try {
      return this._repository.getRecommededChannel(id)
    } catch (error) {
      console.log('error',error);
      throw error
    }
  };
  existingChannnel = async (channelName: string): Promise<Channel | null> => {
    try {
      return this._repository.existingChannnel(channelName);
    } catch (error) {
      throw error;
    }
  };
  editChannel = async (
    _id: string,
    channelName: string,
    filePath: string
  ): Promise<Channel | null> => {
    return this._repository.editChannel(_id, channelName, filePath);
  };
  async getChannel(id: string): Promise<Channel | null> {
    try {
      return await this._repository.getChannel(id);
    } catch (error) {
      throw error;
    }
  }
}
