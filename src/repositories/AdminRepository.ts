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

  getChannels = async (page:number,limit:number): Promise<{allChannels:Channel[] | null,totalcount:number}> => {
    try {
      const skip = (page - 1) * limit;
      const channels = await ChannelModel.find()
      .skip(skip)
      .limit(limit)
      .populate("username");
  
      const allChannels = channels.map((channel) => {
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
      const totalcount = await ChannelModel.countDocuments();
      return {allChannels,totalcount};
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

  getUsers = async (page: number, limit: number): Promise<{users:User[] | null,totalCount:number}> => {
    try {
      const skip = (page - 1) * limit;
      console.log('query is',page,limit);
      console.log('skip is',skip);
      const users = await UserModel.aggregate([
        {
          $match: {
            role: { $ne: "Admin" },
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
      console.log('users are',users);
      const totalCount = await UserModel.countDocuments({ role: { $ne: "Admin" } });
      return { users, totalCount };
      return {users,totalCount};
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
