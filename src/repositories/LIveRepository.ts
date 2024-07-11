// import mongoose from "mongoose";
import mongoose from "mongoose";
import { Channel } from "../entities/Channel";
import { ChannelModel } from "../model/channelModel";
import { LiveHistoryModel } from "../model/liveHistory";
import { ILiveRepository } from "../providers/interfaces/ILiveRepository";
import { LiveHistory } from "../entities/liveHistory";

export class LiveRepository implements ILiveRepository {
  fetchAllLives = async (
    channelId: string
  ): Promise<LiveHistory[] | null> => {
    try {

      const channel = new mongoose.Types.ObjectId(channelId);

      const lives = await LiveHistoryModel.find({
        channelId:channel,
     

      })
        .populate({
          path: 'viewerIds',
          select: 'username',
          model: 'User'
        })
        .populate({
          path: 'channelId',
          select: 'channelName',
          model: 'Channel'
        })
        .exec();
  
      if (!lives || lives.length === 0) {
        return null;
      }
      
      // console.log('history fetched',lives);

      return lives.map((live) => ({
        _id: live._id,
        channelId: live.channelId,
        startDate: live.startDate,
        startTime: live.startTime,
        endTime: live.endTime,
        roomId: live.roomId,
        streamerName: live.streamerName,
        viewerIds: live.viewerIds,
        viewerCount: live.viewerCount,
        duration: live.duration,
        liveName:live.liveName
      }));

    } catch (error) {
      throw error;
    }
  }
  onUpdateLiveHistoryEnded = async (
    RoomId: number
  ): Promise<string | null> => {
    try {
      const currentDateTime = new Date();
  
      const updatedLiveHistory = await LiveHistoryModel.findOneAndUpdate(
        {
          roomId: RoomId,
         
        },
        {
          $set: {
            endTime: currentDateTime,
          },
        },
        { new: true }
      );
      // console.log(updatedLiveHistory);
      if (!updatedLiveHistory) {
        throw new Error("LiveHistory not found");
      }
  
      return updatedLiveHistory._id.toString();
    } catch (error) {
      throw error;
    }
  };
  onUpdateLiveHistoryUsers = async (
    RoomId: number,
    userId: string
  ): Promise<string | null> => {
    try {
      // Convert userId to ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId.trim());

      // Get the current date in YYYY-MM-DD format

      const updatedLiveHistory = await LiveHistoryModel.findOneAndUpdate(
        {
          roomId: RoomId,
        
        },
        {
          $addToSet: {
            viewerIds: userObjectId,
          },
          $inc: {
            viewerCount: 1,
          },
        },
        { new: true }
      );

      await LiveHistoryModel.find({
        roomId: RoomId,
        startDate: new Date(),
      });
      // console.log(live);

      if (!updatedLiveHistory) {
        throw new Error("LiveHistory not found");
      }
      // console.log('updated the user detail of the live');
      return updatedLiveHistory._id.toString();
    } catch (error) {
      throw error;
    }
  };
  onUpdateLiveHistory = async (
    streamerId: string,
    streamName: string,
    roomId: number,
    channelId: string
  ): Promise<string | null> => {
    try {
      // Convert streamerId and channelId to ObjectId
      const streamerObjectId = new mongoose.Types.ObjectId(streamerId);
      const channelObjectId = new mongoose.Types.ObjectId(channelId);
      const currentTime = new Date();
      const options = { timeZone: "Asia/Kolkata" };
      const localTimeString = currentTime.toLocaleString("en-US", options);

      // Find or create LiveHistory document
      const liveHistory = await LiveHistoryModel.findOneAndUpdate(
        { roomId: roomId },
        {
          $setOnInsert: {
            streamerName: streamerObjectId,
            viewerIds: [],
            viewerCount: 0,
            startDate: new Date(),
            startTime: localTimeString,
            duration: 0,
            channelId: channelObjectId,
            liveName: streamName,
            roomId: roomId,
          },
        },
        { upsert: true, new: true }
      );
      // console.log("live history updated",liveHistory);
      return liveHistory._id.toString();
    } catch (error) {
      throw error;
    }
  };
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
