import { NextFunction, Request, Response } from "express";
import { ILiveInteractor } from "../providers/interfaces/ILiveInteractor";
import { ResponseStatus } from "../constants/statusCodeEnums";

export class LiveController {
  private _interactor: ILiveInteractor;
  constructor(private interactor: ILiveInteractor) {
    this._interactor = interactor;
  }

  onGetChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.user as { _id: string };
      console.log("userid", _id);
      const channel = await this._interactor.onGetChannel(_id);
      if (!channel) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: "channel not found" });
      }
      console.log("channel is", channel);
      res
        .status(ResponseStatus.OK)
        .json({ message: "fetched", channeldata: channel });
    } catch (error) {
      next(error);
    }
  };
  onUpdateStartLiveInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("here");
      const { _id } = req.user as { _id: string };
      console.log("userid", _id);

      const channel = await this._interactor.onGetChannel(_id);
      if (!channel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
      const updatedChannel = await this.interactor.onUpdateStartLiveInfo(
        channel._id as string,
        parseInt(req.params.roomId)
      );
      if (!updatedChannel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "error updating live info" });
      }
      res.status(ResponseStatus.OK).json({ message: "Success" });
    } catch (error) {
      next(error);
    }
  };
  onUpdateStopLiveInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("here");
      const { _id } = req.user as { _id: string };
      console.log("userid", _id);

      const channel = await this._interactor.onGetChannel(_id);
      if (!channel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
      const updatedChannel = await this.interactor.onUpdateStopLiveInfo(
        channel._id as string
      );
      if (!updatedChannel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "error updating live info" });
      }
      res.status(ResponseStatus.OK).json({ message: "Success" });
    } catch (error) {
      next(error);
    }
  };
  onGetReconmmendedLives = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("here");
      const { _id } = req.user as { _id: string };

      const channel = await this._interactor.onGetChannel(_id);
      if (!channel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
      const liveChannels=await this._interactor.onGetRecommendedLives(channel._id as string) 

      if(!liveChannels){
        return res
        .status(ResponseStatus.BadRequest)
        .json({ message: "live channel not found" });
      }

      res.status(ResponseStatus.OK).json({ message: "Success" , recommendedLives:liveChannels});
    } catch (error) {
      next(error);
    }
  };
  onUpdateLiveHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.user as { _id: string };

      const channel = await this._interactor.onGetChannel(_id);
      if (!channel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
      console.log(req.body);
      const isLiveUpdate=await this.interactor.onUpdateLiveHistory(_id,req.body.payload.liveName,req.body.payload.RoomId,channel._id as string)
      if (!isLiveUpdate) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
      res
          .status(ResponseStatus.OK)
          .json({ message: "Live started",liveId:isLiveUpdate });
    } catch (error) { 
      next(error);
    }
  };
  onUpdateLiveHistoryUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("here");
      const { _id } = req.user as { _id: string };

      const channel = await this._interactor.onGetChannel(_id);
      if (!channel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
     console.log(req.body);
      const isLiveUpdate=await this.interactor.onUpdateLiveHistoryUsers(req.body.payload.RoomId,req.body.payload.user)
      if (!isLiveUpdate) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
      res
          .status(ResponseStatus.OK)
          .json({ message: "channel not found",liveId:isLiveUpdate });
    } catch (error) { 
      next(error);
    }
  };
  onUpdateLiveHistoryEnd = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("here");
      const { _id } = req.user as { _id: string };

      const channel = await this._interactor.onGetChannel(_id);
      if (!channel) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
     console.log(req.body);
      const isLiveUpdate=await this.interactor.onUpdateLiveHistoryEnded(req.body.payload.RoomId)
      if (!isLiveUpdate) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "channel not found" });
      }
      res
          .status(ResponseStatus.OK)
          .json({ message: "channel not found",liveId:isLiveUpdate });
    } catch (error) { 
      next(error);
    }
  };
  fetchLiveHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("here");
      const liveHistory=await this.interactor.fetchAllLives(req.params.channelId)
      console.log(liveHistory);
      if (!liveHistory) {
        return res
        .status(ResponseStatus.BadRequest)
        .json({ message: "channel not found" });
      }
      res
          .status(ResponseStatus.OK)
          .json({ message: "channel not found",liveHistory:liveHistory });
    } catch (error) { 
      next(error);
    }
  };
}
