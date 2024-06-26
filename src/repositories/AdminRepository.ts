import { Channel } from "../entities/Channel";
import {
  AdminWalletDocument,
  Subscription,
  channelSubscription,
} from "../entities/Subscription";
import { User } from "../entities/User";
import { AdminWalletModel } from "../model/adminWallet";
import { ChannelModel } from "../model/channelModel";
import { channelSubscriptionModel } from "../model/channelSubscription";
import { UserModel } from "../model/userModel";
import { WebsiteMembershipModel } from "../model/websiteMembership";
import { SubscriptionModel } from "../model/websiteSubscription";
import { IAdminRepository } from "../providers/interfaces/IAdminRepository";

export class AdminRepository implements IAdminRepository {
  
  fetchDashboardData = async (): Promise<{monthlySubscription: { [key: string]: number } | null}> => {
    try {
      const memberShipModel = await WebsiteMembershipModel.find();
      if (!memberShipModel) {
        throw new Error("Channel not found");
      }
      const monthlySubscription: { [key: string]: number } = {};

      memberShipModel.forEach((subscriber) => {
        const date = new Date(subscriber.createdAt);
        const subscriptionMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

        if (monthlySubscription[subscriptionMonth]) {
          monthlySubscription[subscriptionMonth]++;
        } else {
          monthlySubscription[subscriptionMonth] = 1;
        }
      });
      console.log(monthlySubscription);
      return {monthlySubscription};
    } catch (error) {
      throw error;
    }
};

  fetchMembership = async (): Promise<{
    member: AdminWalletDocument[] | null;
    wallet: number;
  }> => {
    try {
      const members = await AdminWalletModel.find({}, { adminId: 0 })
        .populate({
          path: "userId",
          select: "username",
        })
        .exec();

      const totalWallet = members.reduce(
        (total, member) => total + member.amount,
        0
      );
      console.log(members);
      return { member: members, wallet: totalWallet };
    } catch (error) {
      throw error;
    }
  };
  getAllChannelPlan = async (): Promise<channelSubscription[] | null> => {
    try {
      const plans = await channelSubscriptionModel.find();
      if (plans) {
        return plans;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  addChannelSubscription = async (
    data: channelSubscription
  ): Promise<channelSubscription | null> => {
    try {
      if (!data) {
        return null;
      }

      const newSubscription = new channelSubscriptionModel({
        month: data.month,
        price: data.price,
        description: data.description,
      });

      const createdSubscription = await newSubscription.save();
      console.log(createdSubscription);
      return createdSubscription as channelSubscription;
    } catch (error) {
      throw error;
    }
  };

  getAllPlan = async (): Promise<Subscription[] | null> => {
    try {
      const plans = await SubscriptionModel.find();
      if (plans) {
        return plans;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  insertSubscription = async (
    data: Subscription
  ): Promise<Subscription | null> => {
    try {
      if (!data) {
        return null;
      }

      const newSubscription = new SubscriptionModel({
        month: data.month,
        price: data.price,
      });

      const createdSubscription = await newSubscription.save();
      return createdSubscription as Subscription;
    } catch (error) {
      throw error;
    }
  };

  getChannelsCount = async (): Promise<number | null> => {
    try {
      const result = await ChannelModel.aggregate([
        { $count: "totalChannels" },
      ]);

      if (result.length > 0) {
        return result[0].totalChannels;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error in getChannelCount:", error);
      throw error;
    }
  };
  getUsersCount = async (): Promise<number | null> => {
    try {
      const result = await UserModel.aggregate([
        { $match: { role: { $ne: "Admin" } } },
        { $count: "totalUsers" },
      ]);

      if (result.length > 0) {
        return result[0].totalUsers;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error in getUsersCount:", error);
      throw error;
    }
  };
  getUserOne = async (userId: string): Promise<User | null> => {
    try {
      return await UserModel.findById(userId);
    } catch (error) {
      throw error;
    }
  };
  blockChannel = async (
    id: string
  ): Promise<{ update: boolean; channel: Channel | null }> => {
    try {
      const channeldata = await ChannelModel.findById(id);
      if (!channeldata) {
        return { update: false, channel: null };
      }
      channeldata.isblocked = !channeldata.isblocked;
      await channeldata.save();

      const newChannelData: Channel = {
        _id: channeldata._id.toString(),
        username: channeldata.username.toString(),
        channelName: channeldata.channelName,
        followers: channeldata.followers.map((follower) => ({
          username: follower.username,
          userId: follower.userId.toString(),
        })),
        subscription: channeldata.subscription,
        banner: channeldata.banner,
        video: channeldata.video.map((video) => ({
          url: video.url,
          views: video.views,
        })),
        isLive: channeldata.isLive,
        lastDateOfLive: channeldata.lastDateOfLive,
        isblocked: channeldata.isblocked,
        liveRoom: channeldata?.liveRoom,
      };
      return { update: true, channel: newChannelData };
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  };
  getChannels = async (
    page: number,
    limit: number
  ): Promise<{ allChannels: Channel[] | null; totalcount: number }> => {
    try {
      const skip = (page - 1) * limit;
      const channels = await ChannelModel.find()
        .skip(skip)
        .limit(limit)
        .populate({ path: "username", select: "username" });

      const allChannels = channels.map((channel) => {
        const {
          username,
          channelName,
          followers,
          subscription,
          banner,
          video,
          lastDateOfLive,
          isblocked,
          _id,
          liveRoom,
        } = channel;
        console.log("channel", channel);
        return {
          _id: _id.toString(),
          username: username.username,
          channelName,
          followers: followers.map((follower) => ({
            username: follower.username,
            userId: follower.userId.toString(),
          })),
          subscription,
          banner,
          video: video.map((vid) => ({
            url: vid.url,
            views: vid.views,
          })),
          lastDateOfLive,
          isblocked,
          liveRoom,
        } as Channel;
      });
      console.log("all channels", allChannels);

      const totalcount = await ChannelModel.countDocuments();
      return { allChannels, totalcount };
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

  getUsers = async (
    page: number,
    limit: number
  ): Promise<{ users: User[] | null; totalCount: number }> => {
    try {
      const skip = (page - 1) * limit;
      console.log("query is", page, limit);
      console.log("skip is", skip);
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
      console.log("users are", users);
      const totalCount = await UserModel.countDocuments({
        role: { $ne: "Admin" },
      });
      return { users, totalCount };
      return { users, totalCount };
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
