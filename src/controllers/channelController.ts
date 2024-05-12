import { Request, Response, NextFunction } from "express";
import { IChannelInteractor } from "../providers/interfaces/IChannelInteractor";
import { ResponseStatus } from "../constants/statusCodeEnums";

export class ChannelController {
  private _interactor: IChannelInteractor;

  constructor(interactor: IChannelInteractor) {
    this._interactor = interactor;
  }

  onGetChannels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req user is ", req.user);
      if (req.user) {
        const { _id } = req.user as { _id: string };
        console.log("userid is", _id);
        const channeldata = await this._interactor.getChannel(_id);
        console.log("chanenl data is ", channeldata);
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
  onIsFollow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
       
    } catch (error) {
      next(error)
    }

  };
  
  onFollowChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        console.log('the follow channel is',req.body);
        const {_id}=req.user as {_id:string}
        const isfollow=await this._interactor.isFollow(_id,req.body)
        console.log('is fllow cntrl',isfollow);
        if(isfollow){
          return res.status(ResponseStatus.BadRequest).json({message:"Already Followed"})
        }
        const updatedChannel=await this._interactor.followChannel(_id,req.body)
        console.log(updatedChannel);
        if(updatedChannel){
          return res.status(ResponseStatus.OK).json({message:"Following",channel:updatedChannel})
        }
        res.status(ResponseStatus.BadRequest).json({message:"Error For Following"})
    } catch (error) {
      next(error)
    }
  };
  onUnFollowChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        console.log('the follow channel is',req.body);
        const {_id}=req.user as {_id:string}
        const isfollow=await this._interactor.isFollow(_id,req.body)
        console.log('is fllow cntrl',isfollow);
        if(!isfollow){
          return res.status(ResponseStatus.BadRequest).json({message:"You didn't follow"})
        }
        const updatedChannel=await this._interactor.unfollowChannel(_id,req.body)
        console.log(updatedChannel);
        if(updatedChannel){
          return res.status(ResponseStatus.OK).json({message:"unfollowing",channel:updatedChannel})
        }
        res.status(ResponseStatus.BadRequest).json({message:"Error For unFollowing"})
    
      
    } catch (error) {
      next(error)
    }
  };

}
