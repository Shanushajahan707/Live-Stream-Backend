import { Request, Response, NextFunction } from "express";
import { IChannelInteractor } from "../providers/interfaces/IChannelInteractor";
import { ResponseStatus } from "../constants/statusCodeEnums";
import * as XLSX from 'xlsx';

export class ChannelController {
  private _interactor: IChannelInteractor;

  constructor(interactor: IChannelInteractor) {
    this._interactor = interactor;
  }

  onGetChannels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("req user is ", req.user);
      if (req.user) {
        const { _id } = req.user as { _id: string };
        // console.log("userid is", _id);
        const channeldata = await this._interactor.getChannel(_id);
        // console.log("chanenl data is ", channeldata);
        if (channeldata) {
          return res
            .status(ResponseStatus.OK)
            .json({ message: "Channel data fetched", channeldata });
        } else {
          return res
            .status(ResponseStatus.NotFound)
            .json({ message: "User channel is not found" });
        }
      } else {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  };
  onEditChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("the datas are ", req.body);
      console.log("the img are ", req.file?.filename);
      if (!req.body.channelName) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: "ChannelName is not inserted" });
      }
      const { _id } = req.user as { _id: string };

      const channelName: string = req.body.channelName;
      const filePath: string | undefined = req.file?.filename;
      console.log(_id, channelName, filePath);
      const existingChannnel = await this._interactor.existingChannnel(
        channelName
      );
      if (existingChannnel) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: "ChannelName Already Taken" });
      }
      const newChannelData = await this._interactor.editChannel(
        _id,
        channelName,
        filePath ?? ""
      );
      console.log("updaeted", newChannelData);
      if (newChannelData) {
        console.log("ChannelData edited successfully");
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: "ChannelData edited successfully", newChannelData });
      } else {
        console.log("Failed to edit ChannelData");
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: "Failed to edit ChannelData" });
      }
    } catch (error) {
      console.log("here");
      next(error);
    }
  };
  onGetRecommendedChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.user as { _id: string };
      const recommendedChannels = await this._interactor.getRecommededChannel(
        _id
      );
      if (!recommendedChannels) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Fail to fetch channels" });
      }
      res
        .status(ResponseStatus.Accepted)
        .json({ message: "Recommended channel fetched", recommendedChannels });
    } catch (error) {
      console.log("err", error);
      next(error);
    }
  };
  onIsFollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  onFollowChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("the follow channel is", req.body);
      const { _id } = req.user as { _id: string };
      const isfollow = await this._interactor.isFollow(_id, req.body);
      console.log("is fllow cntrl", isfollow);
      if (isfollow) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Already Followed" });
      }
      const updatedChannel = await this._interactor.followChannel(
        _id,
        req.body
      );
      console.log(updatedChannel);
      if (updatedChannel) {
        return res
          .status(ResponseStatus.OK)
          .json({ message: "Following", channel: updatedChannel });
      }
      res
        .status(ResponseStatus.BadRequest)
        .json({ message: "Error For Following" });
    } catch (error) {
      next(error);
    }
  };
  onUnFollowChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("the follow channel is", req.body);
      const { _id } = req.user as { _id: string };
      const isfollow = await this._interactor.isFollow(_id, req.body);
      console.log("is fllow cntrl", isfollow);
      if (!isfollow) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "You didn't follow" });
      }
      const updatedChannel = await this._interactor.unfollowChannel(
        _id,
        req.body
      );
      console.log(updatedChannel);
      if (updatedChannel) {
        return res
          .status(ResponseStatus.OK)
          .json({ message: "unfollowing", channel: updatedChannel });
      }
      res
        .status(ResponseStatus.BadRequest)
        .json({ message: "Error For unFollowing" });
    } catch (error) {
      next(error);
    }
  };
  onGetFullFollowChannels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.user as { _id: string };
      console.log(_id);
      const followedChannels = await this._interactor.getFullFollowChannels(
        _id
      );
      if (!followedChannels) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Unable to fetch the channel" });
      }
      res.status(ResponseStatus.Accepted).json({
        message: "Fetched followed Channels",
        follwedChannels: followedChannels,
      });
    } catch (error) {
      next(error);
    }
  };
  onGetFollowChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("channel id through params", req.params.channelId);
      const followChannel = await this._interactor.getFollowChannel(
        req.params.channelId
      );
      if (!followChannel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error find the channel" });
      }
      res
        .status(ResponseStatus.Accepted)
        .json({ message: "Fetch Channel data", channel: followChannel });
    } catch (error) {
      next(error);
    }
  };

  onUploadShorts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Channel ID through params:", req.params.channelId);
      console.log("File is:", req.file);

      if (!req.file || !req.file.mimetype.startsWith("video/mp4")) {
        return res
          .status(400)
          .json({ message: "Invalid file type. Please upload a .mp4 file." });
      }

      const isUploaded = await this._interactor.uploadShort(req.file);
      if (!isUploaded) {
        return res.status(400).json({ message: "Error while uploading" });
      }

      console.log("Uploaded:", isUploaded);
      const uploadOnDp = await this._interactor.shortInDb(
        req.params.channelId,
        isUploaded
      );
      console.log("Upload on DB:", uploadOnDp);
      if (uploadOnDp) {
        return res.status(202).json({ message: "Uploading done", uploadOnDp });
      }
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
  onUpdateViews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("Channel ID through params:", req.params.channelId);
      // console.log("File is:", req.body.videourl);
      const updatedviews = await this._interactor.updateViews(
        req.params.channelId,
        req.body.videourl
      );
      if (!updatedviews) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "updated views" });
      }
      return res
        .status(ResponseStatus.OK)
        .json({ message: "views updated", channel: updatedviews });
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
  onSearchChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.body.query;
      const { _id } = req.user as { _id: string };
      const channels = await this._interactor.onSearchChannels(query, _id);
      if (!channels) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "not found" });
      }
      // console.log("channel are", channels.length);
      res
        .status(ResponseStatus.OK)
        .json({ message: "Search Done", channels: channels });
      console.log("query", query);
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
  onIsMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.user as { _id: string };
      const channelId = req.params.channelId;
      const isMember = await this._interactor.isChannelMember(_id, channelId);
      if (!isMember?._id) {
        console.log("not a member");
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Is not a memeber", isMember: false });
      }
      console.log("useris subscribed");
      res
        .status(ResponseStatus.OK)
        .json({ message: "Is a memeber", isMember: true });
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
  onSubscribeChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.user as { _id: string };
      const channelId = req.body.channelId;
      const isMember = await this._interactor.isChannelMember(_id, channelId);
      if (isMember?._id) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Already subscribed", isMember: true });
      }
      // console.log("user is not subscribed this channel", req.body);
      const subscribe = await this._interactor.subscribeChannel(
        _id,
        req.body.channelId,
        req.body.planId,
        req.body.paymentId
      );
      if (!subscribe) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error while subscribe" });
      }
      res.status(ResponseStatus.Created).json({
        message: "Subscription success",
        isMember: true,
        payment: true,
      });
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
  onGetAllSubscribedMemebers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string, 10);
      const limit = parseInt(req.query.limit as string, 10);

      const { _id } = req.user as { _id: string };
      const channel = await this._interactor.getChannel(_id);
      if (!channel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Channel is not found" });
      }
      // console.log(channel);
      const subscribedMembers = await this._interactor.getAllSubscribedMembers(
        channel._id as string,
        page,
        limit
      );
      if (!subscribedMembers) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Can't fetch the members" });
      }
      // console.log("members", subscribedMembers);
      res
        .status(ResponseStatus.OK)
        .json({
          message: "Fetched the members",
          members: subscribedMembers.subscribedmembers,
          totalcount: subscribedMembers.totalcount,
        });
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
  onFetchRevenueChart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.user as { _id: string };
      const revenueChart=await this._interactor.fetRevenueChart(_id)
      if(!revenueChart){
        return res.status(ResponseStatus.BadRequest).json({message:"Unable to fetch chart"})
      }
      console.log(revenueChart);

      res
      .status(ResponseStatus.OK)
      .json({
        message: "Fetched the revueChart",
        revenue: revenueChart.monthlySubscription,
        totalAmount:revenueChart.totalAmount
      });
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
  onFetchExcelData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.user as { _id: string };
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
  
      const data = await this._interactor.getExcelData(_id, startDate, endDate);
  
      if (!data) {
        return res.status(ResponseStatus.BadRequest).json({ message: "Error in fetching Excel data" });
      }
  
      const formattedData = data.map(entry => ({
        _id: entry._id,
        userId: entry.members.userId as string,
        userChannelId: entry.members.userChannelId as string,
        channelId: entry.members.channelId as string,
        channelPlanId: entry.members.channelPlanId as string,
        paymentId: entry.members.paymentId,
        createdAt: entry.createdAt,
        endsIn: entry.endsIn,
      }))
      console.log(formattedData);
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      res.setHeader('Content-Disposition', 'attachment; filename=RevenueReport.xlsx');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(Buffer.from(excelBuffer));
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
}
