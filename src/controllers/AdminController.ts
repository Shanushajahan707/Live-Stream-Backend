import { Request, Response, NextFunction } from "express";
import { IAdminInteractor } from "../providers/interfaces/IAdminInteractor";
import { ResponseStatus } from "../constants/statusCodeEnums";

export class AdminController {
  private _interactor: IAdminInteractor;
  constructor(interactor: IAdminInteractor) {
    this._interactor = interactor;
  }

  onGetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10);
      const limit = parseInt(req.query.limit as string, 10);
      console.log("controller from page and limit", page, limit);
      const response = await this._interactor.getUsers(page, limit);
      if (response) {
        console.log("users are", response.users);
        return res
          .status(ResponseStatus.OK)
          .json({
            message: "Successfully get all the users",
            users: response.users,
            totalcount: response.totalCount,
          });
      }
    } catch (error) {
      next(error);
    }
  };
  onBlockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("id is", req.params.id);
      const status = await this._interactor.blockUser(req.params.id);
      if (status.update) {
        console.log("success");
        res
          .status(ResponseStatus.Accepted)
          .json({ message: "Successfully Updated", user: status.user });
      } else {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error toggling user status" });
      }
    } catch (error) {
      next(error);
    }
  };
  onBlockChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("id is", req.params.id);
      const status = await this._interactor.blockChannel(req.params.id);
      if (status.update) {
        console.log("success");
        res
          .status(ResponseStatus.Accepted)
          .json({ message: "Successfully Updated", channels: status.channel });
      } else {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error toggling chanenl status" });
      }
    } catch (error) {
      next(error);
    }
  };
  onGetFullChannels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string, 10);
      const limit = parseInt(req.query.limit as string, 10);
      const allChannels = await this._interactor.getChannels(page,limit);
      console.log(allChannels.allChannels);
      if (allChannels) {
        return res
          .status(ResponseStatus.OK)
          .json({ message: "fetching channals complete", channels:allChannels.allChannels,totalcount:allChannels.totalcount });
      } else {
        return res.status(400).json({ message: "Error fetching channals" });
      }
    } catch (error) {
      next(error);
    }
  };
}
