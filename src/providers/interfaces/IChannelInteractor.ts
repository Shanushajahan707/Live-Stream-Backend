import { Channel } from "../../entities/Channel";

export interface IChannelInteractor {
  getChannel(id: string): Promise<Channel | null>;
  editChannel(
    userid: string,
    channelName: string,
    filePath: string
  ): Promise<Channel | null>;
  existingChannnel(channelName: string): Promise<Channel | null>;
  getRecommededChannel(id: string): Promise<Channel[] | null>;
  followChannel(userid: string, channelData: Channel): Promise<Channel | null>;
  unfollowChannel(
    userid: string,
    channelData: Channel
  ): Promise<Channel | null>;
  isFollow(userid: string, channelDate: Channel): Promise<boolean>;
  getFullFollowChannels(userid: string): Promise<Channel[] | null>;
  getFollowChannel(channelId: string): Promise<Channel | null>;
  uploadShort(file: Express.Multer.File): Promise<string>;
  shortInDb(channelId: string, location: string): Promise<Channel | null>;
  updateViews(channelId: string, location: string): Promise<Channel | null>;
  onSearchChannels(query:string,userid:string):Promise<Channel[]|null>
}
