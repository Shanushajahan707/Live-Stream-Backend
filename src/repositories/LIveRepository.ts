// import mongoose from "mongoose";
import { Channel } from "../entities/Channel";
import { ChannelModel } from "../model/channelModel";
import { ILiveRepository } from "../providers/interfaces/ILiveRepository";

export class LiveRepository implements ILiveRepository {
  onGetRecommendedLives = async (
    channelId: string
  ): Promise<Channel[] | null> => {
    try {
      const liveChannels = await ChannelModel.find({
        _id: { $ne: channelId },
        isLive: true,
      }).exec();
      return liveChannels;
    } catch (error) {
      throw error;
    }
  };
  onUpdateStopLiveInfo = async (channelId: string): Promise<Channel | null> => {
    try {
      const updatedChannel = await ChannelModel.findByIdAndUpdate(
        channelId,
        [
          {
            $set: {
              isLive: false,
              liveRoom: "",
            },
          },
        ],
        { new: true }
      );
      console.log("live details updated", updatedChannel);
      return updatedChannel;
    } catch (error) {
      throw error;
    }
  };

  onUpdateStartLiveInfo = async (
    channelId: string,
    roomId: number
  ): Promise<Channel | null> => {
    try {
      const updatedChannel = await ChannelModel.findByIdAndUpdate(
        channelId,
        [
          {
            $set: {
              isLive: true,
              liveRoom: roomId,
            },
          },
        ],
        { new: true }
      );
      console.log("live details updated", updatedChannel);
      return updatedChannel;
    } catch (error) {
      throw error;
    }
  };

  onGetChannel = async (userid: string): Promise<Channel | null> => {
    try {
      // Retrieve the channel based on the user ID
      const channel = await ChannelModel.findOne({ username: userid });

      // If no channel is found, return null
      if (!channel) {
        return null;
      }

      const mappedChannel: Channel = {
        _id: channel._id.toString(),
        username: channel.username.toString(),
        channelName: channel.channelName,
        followers: channel.followers.map((follower) => ({
          username: follower.username,
          userId: follower.userId.toString(),
        })),
        subscription: channel.subscription,
        banner: channel.banner,
        video: channel.video.map((videoObj) => ({
          url: videoObj.url.toString(),
          views: videoObj.views || 0,
        })),
        isLive: channel.isLive,
        lastDateOfLive: channel.lastDateOfLive,
        isblocked: channel.isblocked,
        liveRoom: channel?.liveRoom,
      };

      // Return the mapped channel data
      // console.log('mappedChannel',mappedChannel);
      return mappedChannel;
    } catch (error) {
      // Log any errors
      console.error("Error fetching channel:", error);
      // Throw the error for handling further up the chain
      throw error;
    }
  };
}
