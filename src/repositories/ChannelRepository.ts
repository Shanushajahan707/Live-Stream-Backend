import mongoose from "mongoose";
import { Channel } from "../entities/Channel";
import { ChannelModel } from "../model/channelModel";
import { IChannelRepository } from "../providers/interfaces/IChannelRepository";
import { UserModel } from "../model/userModel";

export class channelRepository implements IChannelRepository {
  unfollowChannel = async (
    userid: string,
    channelData: Channel
  ): Promise<Channel | null> => {
    try {
      // console.log("userid", userid);
      // console.log("channel data", channelData);

      const user = await UserModel.findById(userid, { _id: 1, username: 1 });
      if (!user) {
        throw new Error("User not found");
      }
      console.log("user", user);

      const updateOperation = {
        $pull: {
          followers: {
            userId: user._id,
          },
        },
      };
      // console.log("update operation", updateOperation);

      const updatedMongooseChannel = await ChannelModel.findOneAndUpdate(
        { _id: channelData._id },
        updateOperation,
        { new: true }
      );
      // console.log("updated mongoose", updatedMongooseChannel);

      if (updatedMongooseChannel) {
        const updatedChannel: Channel = {
          _id: updatedMongooseChannel._id.toString(),
          username: updatedMongooseChannel.username.toString(),
          channelName: updatedMongooseChannel.channelName,
          followers: updatedMongooseChannel.followers.map(
            (follower) => follower.username
          ),
          subscription: updatedMongooseChannel.subscription,
          banner: updatedMongooseChannel.banner,
          video: updatedMongooseChannel.video,
          lives: updatedMongooseChannel.lives,
          isblocked: updatedMongooseChannel.isblocked,
        };
        // console.log("updated channel", updatedChannel);
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
      // console.log("userid", userid);
      // console.log("channel data", channelData);

      // Find the user by ID
      const user = await UserModel.findById(userid, { _id: 1, username: 1 });
      if (!user) {
        throw new Error("User not found");
      }
      // console.log("user", user);
      // Prepare the update operation
      const updateOperation = {
        $push: {
          followers: {
            username: user.username,
            userId: user._id,
          },
        },
      };
      // console.log("updated operation", updateOperation);
      const updatedMongooseChannel = await ChannelModel.findOneAndUpdate(
        { _id: channelData._id },
        updateOperation,
        { new: true }
      );
      // console.log("updated mongoose", updatedMongooseChannel);
      if (updatedMongooseChannel) {
        const updatedChannel: Channel = {
          _id: updatedMongooseChannel._id.toString(),
          username: updatedMongooseChannel.username.toString(),
          channelName: updatedMongooseChannel.channelName,
          followers: updatedMongooseChannel.followers.map(
            (follower) => follower.username
          ),
          subscription: updatedMongooseChannel.subscription,
          banner: updatedMongooseChannel.banner,
          video: updatedMongooseChannel.video,
          lives: updatedMongooseChannel.lives,
          isblocked: updatedMongooseChannel.isblocked,
        };
        // console.log("updated channel", updatedChannel);
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
        .limit(3)
        .exec();

      const channels: Channel[] = result.map((doc) => ({
        username: doc.username.toString(),
        channelName: doc.channelName,
        followers: doc.followers.map((follower) => follower.userId),
        subscription: doc.subscription,
        banner: doc.banner,
        video: doc.video,
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
      followers: newData.followers.map((follower) => follower.username),
      subscription: newData.subscription,
      banner: newData.banner,
      video: newData.video,
      lives: newData.lives,
      isblocked: newData.isblocked,
    };

    return channel;
  };

  getChannel = async (id: string): Promise<Channel | null> => {
    try {
      console.log("userid from repo", id);
      const userId = new mongoose.Types.ObjectId(id);
      console.log(userId);
      const channel = await ChannelModel.findOne({ username: userId }).exec();

      if (!channel) {
        return null;
      }
      const channels: Channel = {
        _id: channel._id.toString(),
        username: channel.username.toString(),
        channelName: channel.channelName,
        followers: channel.followers.map((follower) => follower.username),
        subscription: channel.subscription,
        banner: channel.banner,
        video: channel.video,
        lives: channel.lives,
        isblocked: channel.isblocked,
      };
      return channels;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  };
}
