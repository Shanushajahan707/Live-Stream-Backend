import { Channel } from "../../entities/Channel";

export interface IChannelInteractor {
  getChannel(id: string): Promise<Channel | null>;
  editChannel(userid:string,channelName:string,filePath:string):Promise<Channel | null>
  existingChannnel(channelName:string):Promise<Channel | null>
  getRecommededChannel(id:string):Promise<Channel[] | null>
  followChannel(userid:string,channelData:Channel):Promise<Channel|null>
  unfollowChannel(userid:string,channelData:Channel):Promise<Channel|null>
  isFollow(userid:string,channelDate:Channel):Promise<boolean>
}
