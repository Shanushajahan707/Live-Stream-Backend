import { Channel } from "../entities/Channel";
import { User } from "../entities/User";
import { ChannelModel } from "../model/channelModel";
import { UserModel } from "../model/userModel";
import { IAdminRepository } from "../providers/interfaces/IAdminRepository";

export class AdminRepository implements IAdminRepository {
  blockChannel = async (
    id: string
  ): Promise<{ update: boolean; channel: Channel | null }> => {
    try {
      const channeldata = await ChannelModel.findById(id)
      if (!channeldata) {
        return { update: false, channel: null };
      }
      channeldata.isblocked = !channeldata.isblocked;
      await channeldata.save();

      const newChannelData: Channel = {
        _id: channeldata._id.toString(),
        username: channeldata.username.toString(),
        channelName: channeldata.channelName,
        followers: channeldata.followers.map((follower) => follower.username),
        subscription: channeldata.subscription,
        banner: channeldata.banner,
        video: channeldata.video,
        lives: channeldata.lives,
        isblocked: channeldata.isblocked,
      };

      return { update: true, channel: newChannelData };
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  };

  getChannels = async (): Promise<Channel[] | null> => {
    try {
      const channels = await ChannelModel.find().populate("username");

      const simplifiedChannels = channels.map((channel) => {
        const {
          username: { username },
          channelName,
          followers,
          subscription,
          banner,
          video,
          lives,
          isblocked,
          _id,
        } = channel;

        return {
          username,
          channelName,
          followers: followers.map((follower) => follower.username),
          subscription,
          banner,
          video,
          lives,
          isblocked,
          _id: _id.toString(),
        };
      });

      return simplifiedChannels;
    } catch (error) {
      throw error;
    }
  };

  blockUser = async (
    id: string
  ): Promise<{ update: boolean; user: User | null }> => {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return { update: false, user: null };
      }
      user.isblocked = !user.isblocked;
      await user.save();
      const userdata = new User(
        user.username,
        user.email,
        user.password,
        user.role,
        user.dateofbirth ?? new Date(),
        user.isblocked,
        user.googleId,
        user._id.toString()
      );

      return { update: true, user: userdata };
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  };

  getUsers = async (): Promise<User[] | null> => {
    try {
      const users = await UserModel.aggregate([
        {
          $match: {
            role: { $ne: "Admin" },
          },
        },
      ]);
      return users;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
