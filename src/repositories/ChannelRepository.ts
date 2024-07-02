import mongoose, { Types } from "mongoose";
import { Channel } from "../entities/Channel";
import { ChannelModel } from "../model/channelModel";
import { IChannelRepository } from "../providers/interfaces/IChannelRepository";
import { UserModel } from "../model/userModel";
import { ChannelSubscriptionUser, FormattedChannelSubscriptionUser } from "../entities/Subscription";
import { ChannelMembershipModel } from "../model/chennelMembership";
import { channelSubscriptionModel } from "../model/channelSubscription";

export class channelRepository implements IChannelRepository {
  getExcelData = async (userId: string, startDate: string, endDate: string): Promise<FormattedChannelSubscriptionUser[] | null> => {
    try {
      const userChannel = await ChannelModel.findOne({ username: userId }).exec();
  
      if (!userChannel) {
        throw new Error("User channel not found");
      }
  
      const channelId = userChannel._id;
  
      const memberships = await ChannelMembershipModel.find({
        "members.channelId": channelId,
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
      .populate({
        path: "members.userId",
        select: "username",
      })
      .populate({
        path: "members.userChannelId",
        model: "Channel",
        select: "channelName",
      })
      .populate({
        path: "members.channelPlanId",
        model: "ChannelSubscription",
        select: "month price",
      }).exec();
  
      // Map the memberships to extract the needed fields and transform ObjectId and Date fields to strings
      const formattedData: FormattedChannelSubscriptionUser[] = memberships.map(membership => ({
        _id: membership._id.toString(),
        members: {
          userId: membership.members.userId.username,
          userChannelId: membership.members.userChannelId.channelName,
          channelId: membership.members.channelId.toString(),
          channelPlanId: membership.members.channelPlanId.price.toString(),
          paymentId: membership.members.paymentId,
        },
        createdAt: membership.createdAt.toISOString(),
        endsIn: membership.endsIn.toISOString(),
      }));
  
      return formattedData;
    } catch (error) {
      throw error;
    }
  };
  

  fetRevenueChart = async (
    userId: string
  ): Promise<{
    monthlySubscription: { [key: string]: number } | null;
    totalAmount: number;
  }> => {
    try {
      const userChannel = await ChannelModel.findOne({
        username: userId,
      }).exec();

      if (!userChannel) {
        throw new Error("User channel not found");
      }

      const channelId = userChannel._id;

      const memberships = await ChannelMembershipModel.find({
        "members.channelId": channelId,
      })
        .populate({
          path: "members.channelPlanId",
          model: "ChannelSubscription",
          select: "price",
        })
        .exec();

      const monthlySubscription: { [key: string]: number } = {};
      let totalAmount = 0;

      memberships.forEach((subscriber) => {
        const date = new Date(subscriber.createdAt);
        const subscriptionMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;

        const planPrice = subscriber.members.channelPlanId.price;
        totalAmount += planPrice;

        if (monthlySubscription[subscriptionMonth]) {
          monthlySubscription[subscriptionMonth] += planPrice;
        } else {
          monthlySubscription[subscriptionMonth] = planPrice;
        }
      });

      return {
        monthlySubscription: monthlySubscription,
        totalAmount: totalAmount,
      };
    } catch (error) {
      throw error;
    }
  };

  getAllSubscribedMembers = async (
    channelId: string,
    page: number,
    limit: number
  ): Promise<{
    subscribedmembers: ChannelSubscriptionUser[] | null;
    totalcount: number;
  }> => {
    try {
      const skip = (page - 1) * limit;
      const subscribedMembers = await ChannelMembershipModel.find({
        "members.channelId": new mongoose.Types.ObjectId(channelId),
      })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "members.userId",
          select: "username",
        })
        .populate({
          path: "members.userChannelId", // Populate userChannelId instead of channelId
          model: "Channel", // Assuming the model name for ChannelModel is "Channel"
          select: "channelName", // Select fields as needed
        })
        .populate({
          path: "members.channelPlanId",
          model: "ChannelSubscription",
          select: "month price",
        })
        .exec();
      const transformedMembers: ChannelSubscriptionUser[] =
        subscribedMembers.map((member) => ({
          _id: member._id,
          members: {
            userId: member.members.userId.username,
            userChannelId: member.members.userChannelId.channelName,
            channelId: member.members.channelId.toString(),
            channelPlanId: member.members.channelPlanId.month,
            paymentId: member.members.paymentId,
          },
          createdAt: member.createdAt,
          endsIn: member.endsIn,
        }));

      const totalcount = await ChannelMembershipModel.countDocuments({
        "members.channelId": new mongoose.Types.ObjectId(channelId),
      });
      console.log("members", transformedMembers);
      return { subscribedmembers: transformedMembers, totalcount: totalcount };
    } catch (error) {
      throw error;
    }
  };

  subscribeChannel = async (
    userId: string,
    channelId: string,
    planId: string,
    paymentId: string
  ): Promise<ChannelSubscriptionUser | null> => {
    try {
      const planExists = await channelSubscriptionModel.findById(planId);
      if (!planExists) {
        return null;
      }

      const userChannel = await ChannelModel.findOne({ username: userId });
      if (!userChannel) {
        throw new Error("User channel not found");
      }

      // Calculate the endsIn date based on the plan's month duration
      const currentDate = new Date();
      const endsInDate = new Date(currentDate);
      endsInDate.setMonth(currentDate.getMonth() + planExists.month);

      const newMembership = new ChannelMembershipModel({
        members: {
          userId: new Types.ObjectId(userId),
          userChannelId: new Types.ObjectId(userChannel._id),
          channelId: new Types.ObjectId(channelId),
          channelPlanId: new Types.ObjectId(planId),
          paymentId: paymentId,
        },
        createdAt: currentDate,
        endsIn: endsInDate, // Add the calculated endsIn date
      });

      const savedMembership = await newMembership.save();
      const result: ChannelSubscriptionUser = {
        _id: savedMembership._id.toString(),
        members: {
          userId: savedMembership.members.userId.toString(),
          userChannelId: savedMembership.members.userChannelId.toString(),
          channelId: savedMembership.members.channelId.toString(),
          channelPlanId: savedMembership.members.channelPlanId.toString(),
          paymentId: savedMembership.members.paymentId,
        },
        createdAt: savedMembership.createdAt,
        endsIn: savedMembership.endsIn, // Include the endsIn date in the result
      };
      return result;
    } catch (error) {
      throw error;
    }
  };

  isChannelMember = async (
    userId: string,
    channelId: string
  ): Promise<ChannelSubscriptionUser | null> => {
    try {
      const isMember = await ChannelMembershipModel.findOne({
        "members.userId": new mongoose.Types.ObjectId(userId),
        "members.channelId": new mongoose.Types.ObjectId(channelId),
      }).exec();

      if (isMember) {
        const currentDate = new Date();

        if (isMember.endsIn < currentDate) {
          // Subscription period is over, delete the membership
          await ChannelMembershipModel.deleteOne({ _id: isMember._id })
            .exec()
            .then(() => {
              console.log("membership deleted");
            })
            .catch(() => {
              console.log("error in deletion");
            });
          return null;
        }

        // Subscription is still valid, return the membership details
        return {
          _id: isMember._id.toString(),
          members: {
            userId: isMember.members.userId.toString(),
            userChannelId: isMember.members.userChannelId.toString(),
            channelId: isMember.members.channelId.toString(),
            channelPlanId: isMember.members.channelPlanId.toString(),
            paymentId: isMember.members.paymentId,
          },
          createdAt: isMember.createdAt,
          endsIn: isMember.endsIn,
        };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  onSearchChannels = async (
    query: string,
    userid: string
  ): Promise<Channel[] | null> => {
    try {
      const channels = await ChannelModel.find({
        channelName: { $regex: query, $options: "i" },
        username: { $ne: userid },
      });
      if (channels.length > 0) {
        return channels;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  updateViews = async (
    channelId: string,
    location: string
  ): Promise<Channel | null> => {
    try {
      const aggregationPipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(channelId) } },
        { $unwind: "$video" },
        { $match: { "video.url": location } },
        { $group: { _id: "$_id", video: { $first: "$video" } } },
      ];
      const channelAggregateResult = await ChannelModel.aggregate(
        aggregationPipeline
      );

      if (channelAggregateResult.length > 0) {
        channelAggregateResult[0] as Channel;

        const updateResult = await ChannelModel.findOneAndUpdate(
          { _id: channelId, "video.url": location },
          { $inc: { "video.$.views": 1 } },
          { new: true }
        );

        if (updateResult) {
          console.log("Views updated successfully");
          return updateResult;
        } else {
          console.log("Video not found in the channel.");
          return null;
        }
      } else {
        console.log("Video not found in the channel.");
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  shortInDb = async (
    channelId: string,
    location: string
  ): Promise<Channel | null> => {
    try {
      console.log("channelid", channelId, "url", location);
      const channel = await ChannelModel.findById(channelId);

      if (!channel) {
        return null;
      }

      const newVideo = {
        url: location,
        views: 0,
      };

      channel.video.push(newVideo);

      const updatedChannel = (await ChannelModel.findByIdAndUpdate(
        channelId,
        channel,
        { new: true }
      )) as Channel;

      if (!updatedChannel) {
        return null;
      }
      console.log("short inserted", updatedChannel);
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
          followers: doc.followers.map((follower) => ({
            username: follower.username,
            userId: follower.userId.toString(),
          })),
          subscription: doc.subscription,
          banner: doc.banner,
          video: doc.video.map((videoObj) => ({
            url: videoObj.url.toString(),
            views: videoObj.views || 0,
          })),
          isLive: doc.isLive,
          lastDateOfLive: doc.lastDateOfLive,
          isblocked: doc.isblocked,
          liveRoom: doc?.liveRoom,
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
          isLive: updatedMongooseChannel.isLive,
          lastDateOfLive: updatedMongooseChannel.lastDateOfLive,
          isblocked: updatedMongooseChannel.isblocked,
          liveRoom: updatedMongooseChannel?.liveRoom,
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
          isLive: updatedMongooseChannel.isLive,
          lastDateOfLive: updatedMongooseChannel.lastDateOfLive,
          isblocked: updatedMongooseChannel.isblocked,
          liveRoom: updatedMongooseChannel?.liveRoom,
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
        isLive: doc.isLive,
        lastDateOfLive: doc.lastDateOfLive,
        isblocked: doc.isblocked,
        _id: doc._id,
        liveRoom: doc?.liveRoom,
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
      isLive: newData.isLive,
      lastDateOfLive: newData.lastDateOfLive,
      isblocked: newData.isblocked,
      liveRoom: newData?.liveRoom,
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
        isLive: channel.isLive,
        lastDateOfLive: channel.lastDateOfLive,
        isblocked: channel.isblocked,
        liveRoom: channel?.liveRoom,
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
