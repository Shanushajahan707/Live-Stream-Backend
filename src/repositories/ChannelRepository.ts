import mongoose from "mongoose";
import { Channel } from "../entities/Channel";
import { ChannelModel } from "../model/channelModel";
import { IChannelRepository } from "../providers/interfaces/IChannelRepository";
import { UserModel } from "../model/userModel";

export class channelRepository implements IChannelRepository {

  shortInDb = async (
    channelId: string,
    location: string
  ): Promise<Channel | null> => {
    try {

      console.log('channelid',channelId,"url",location);
      const channel = await ChannelModel.findById(channelId);
  
      if (!channel) {
        return null; 
      }
  
      const newVideo = {
        url: location,
        views: 0,
      };
  
      channel.video.push(newVideo);
  
      const updatedChannel = await ChannelModel.findByIdAndUpdate(
        channelId,
        channel,
        { new: true }
      ) as Channel;
  
      if (!updatedChannel) {
        return null;
      }
      console.log('short inserted',updatedChannel);
      return updatedChannel;
    } catch (error) {
      throw error;
    }
  };
  
  


  getFollowChannel = async (channelId: string): Promise<Channel | null> => {
    try {
      return await ChannelModel.findById(channelId);
    } catch (error) {
      throw error;
    }
  };
  getFullFollowChannels = async (userid: string): Promise<Channel[] | null> => {
    try {
      const userChannels = await ChannelModel.find({
        "followers.userId": userid,
      });

      if (!userChannels || userChannels.length === 0) {
        return null;
      }

      const channels: Channel[] = userChannels.map((doc) => {
        return {
          _id: doc._id,
          username: doc.username,
          channelName: doc.channelName,
          followers: doc.followers.map((follower) =>
            follower.userId.toString()
          ),
          subscription: doc.subscription,
          banner: doc.banner,
          video: doc.video.map((videoObj) => ({
            url: videoObj.url.toString(),
            views: videoObj.views || 0,
          })),
          lives: doc.lives,
          isblocked: doc.isblocked,
        };
      });

      return channels;
    } catch (error) {
      throw error;
    }
  };
  
  unfollowChannel = async (
    userid: string,
    channelData: Channel
  ): Promise<Channel | null> => {
    try {
      const user = await UserModel.findById(userid, { _id: 1, username: 1 });
      if (!user) {
        throw new Error("User not found");
      }
  
      const updateOperation = {
        $pull: {
          followers: {
            userId: user._id,
          },
        },
      };
  
      const updatedMongooseChannel = await ChannelModel.findOneAndUpdate(
        { _id: channelData._id },
        updateOperation,
        { new: true }
      );
  
      if (updatedMongooseChannel) {
        const updatedChannel: Channel = {
          _id: updatedMongooseChannel._id.toString(),
          username: updatedMongooseChannel.username.toString(),
          channelName: updatedMongooseChannel.channelName,
          followers: updatedMongooseChannel.followers.map((follower) => ({
            username: follower.username,
            userId: follower.userId.toString(),
          })),
          subscription: updatedMongooseChannel.subscription,
          banner: updatedMongooseChannel.banner,
          video: updatedMongooseChannel.video.map((videoObj) => ({
            url: videoObj.url.toString(),
            views: videoObj.views || 0,
          })),
          lives: updatedMongooseChannel.lives,
          isblocked: updatedMongooseChannel.isblocked,
        };
  
        return updatedChannel;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  isFollow = async (userid: string, channelDate: Channel): Promise<boolean> => {
    try {
      const user = await UserModel.findById(userid, { _id: 1, username: 1 });
      if (!user) {
        throw new Error("User not found");
      }
      const channel = await ChannelModel.findById(channelDate._id);
      if (!channel) {
        throw new Error("Channel not found");
      }
      const isFollowing = channel.followers?.some(
        (follower) => follower.userId.toString() === user._id.toString()
      );
      // console.log("Is Following:", isFollowing);
      return isFollowing;
    } catch (error) {
      // console.error("Error in isFollow:", error);
      throw error;
    }
  };

  followChannel = async (
    userid: string,
    channelData: Channel
  ): Promise<Channel | null> => {
    try {
      // Find the user by ID
      const user = await UserModel.findById(userid, { _id: 1, username: 1 });
      if (!user) {
        throw new Error("User not found");
      }
  
      // Prepare the update operation
      const updateOperation = {
        $push: {
          followers: {
            username: user.username,
            userId: user._id,
          },
        },
      };
  
      const updatedMongooseChannel = await ChannelModel.findOneAndUpdate(
        { _id: channelData._id },
        updateOperation,
        { new: true }
      );
  
      if (updatedMongooseChannel) {
        const updatedChannel: Channel = {
          _id: updatedMongooseChannel._id.toString(),
          username: updatedMongooseChannel.username.toString(),
          channelName: updatedMongooseChannel.channelName,
          followers: updatedMongooseChannel.followers.map((follower) => ({
            username: follower.username,
            userId: follower.userId.toString(),
          })),
          subscription: updatedMongooseChannel.subscription,
          banner: updatedMongooseChannel.banner,
          video: updatedMongooseChannel.video.map((videoObj) => ({
            url: videoObj.url.toString(),
            views: videoObj.views || 0,
          })),
          lives: updatedMongooseChannel.lives,
          isblocked: updatedMongooseChannel.isblocked,
        };
  
        return updatedChannel;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
  getRecommededChannel = async (userid: string): Promise<Channel[] | null> => {
    try {
      const result = await ChannelModel.find({ username: { $ne: userid } })
        .sort({ followers: -1 })
        .exec();

      const channels: Channel[] = result.map((doc) => ({
        username: doc.username.toString(),
        channelName: doc.channelName,
        followers: doc.followers.map((follower) => follower.userId),
        subscription: doc.subscription,
        banner: doc.banner,
        video: doc.video.map((videoObj) => ({
          url: videoObj.url.toString(),
          views: videoObj.views || 0,
        })),
        lives: doc.lives,
        isblocked: doc.isblocked,
        _id: doc._id,
      }));

      return channels;
    } catch (error) {
      throw error;
    }
  };

  existingChannnel = async (channelName: string): Promise<Channel | null> => {
    try {
      return await ChannelModel.findOne({ channelName: channelName });
    } catch (error) {
      throw error;
    }
  };

  editChannel = async (
    userid: string,
    channelName: string,
    filePath: string
  ): Promise<Channel | null> => {
    console.log("from repositories", userid, channelName, filePath);
    const newData = await ChannelModel.findOneAndUpdate(
      { username: userid },
      {
        channelName: channelName,
        banner: filePath ? filePath : "/images/channel-banner1.png",
      },
      { new: true }
    );

    if (!newData) {
      return null;
    }

    const channel: Channel = {
      _id: newData._id.toString(),
      username: newData.username.toString(),
      channelName: newData.channelName,
      followers: newData.followers.map((follower) => ({
        username: follower.username,
        userId: follower.userId.toString(),
      })),
      subscription: newData.subscription,
      banner: newData.banner,
      video: newData.video.map((videoObj) => ({
        url: videoObj.url.toString(),
        views: videoObj.views || 0,
      })),
      lives: newData.lives,
      isblocked: newData.isblocked,
    };

    return channel;
  };

  getChannel = async (id: string): Promise<Channel | null> => {
  try {
    // Convert the string ID to a MongoDB ObjectID
    const userId = new mongoose.Types.ObjectId(id);

    // Retrieve the channel based on the user ID
    const channel = await ChannelModel.findOne({ username: userId });

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
      lives: channel.lives,
      isblocked: channel.isblocked,
    };

    // Return the mapped channel data
    return mappedChannel;
  } catch (error) {
    // Log any errors
    console.error("Error fetching channel:", error);
    // Throw the error for handling further up the chain
    throw error;
  }
};



}
