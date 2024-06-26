import { Channel } from "../../entities/Channel";
import { ChannelSubscriptionUser } from "../../entities/Subscription";

export interface IChannelRepository {
  getChannel(id: string): Promise<Channel | null>;
  editChannel(
    userid: string,
    channelName: string,
    filePath: string
  ): Promise<Channel | null>;
  existingChannnel(channelName: string): Promise<Channel | null>;
  getRecommededChannel(userid: string): Promise<Channel[] | null>;
  followChannel(userid: string, channelData: Channel): Promise<Channel | null>;
  unfollowChannel(
    userid: string,
    channelData: Channel
  ): Promise<Channel | null>;
  isFollow(userid: string, channelDate: Channel): Promise<boolean>;
  getFullFollowChannels(userid: string): Promise<Channel[] | null>;
  getFollowChannel(channelId: string): Promise<Channel | null>;
  shortInDb(channelId: string, location: string): Promise<Channel | null>;
  updateViews(channelId: string, location: string): Promise<Channel | null>;
  onSearchChannels(query: string, userid: string): Promise<Channel[] | null>;
  isChannelMember(
    userId: string,
    channelId: string
  ): Promise<ChannelSubscriptionUser | null>;
  subscribeChannel(
    userid: string,
    channelId: string,
    planId: string,
    paymentId: string
  ): Promise<ChannelSubscriptionUser | null>;
  getAllSubscribedMembers(
    channelId: string,
    page: number,
    limit: number
  ): Promise<{
    subscribedmembers: ChannelSubscriptionUser[] | null;
    totalcount: number;
  }>;
  fetRevenueChart(
    userid: string
  ): Promise<{ monthlySubscription: { [key: string]: number } | null,totalAmount: number }>;
}
