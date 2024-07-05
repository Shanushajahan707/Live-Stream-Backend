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
        return res.status(ResponseStatus.OK).json({
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
      const allChannels = await this._interactor.getChannels(page, limit);
      console.log(allChannels.allChannels);
      if (allChannels) {
        return res.status(ResponseStatus.OK).json({
          message: "fetching channals complete",
          channels: allChannels.allChannels,
          totalcount: allChannels.totalcount,
        });
      } else {
        return res.status(400).json({ message: "Error fetching channals" });
      }
    } catch (error) {
      next(error);
    }
  };
  onGetUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("userdata is", req.params.userid);
      const userdata = await this._interactor.getUserOne(req.params.userid);
      if (!userdata) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Can't find the userdata" });
      }
      res
        .status(ResponseStatus.Accepted)
        .json({ message: "User data fetched", userData: userdata });
    } catch (error) {
      next(error);
    }
  };
  onGetUsersCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userscount = await this._interactor.getUsersCount();
      if (!userscount) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Can't find the usercount" });
      }
      // console.log('usrcount',userscount);
      res
        .status(ResponseStatus.Accepted)
        .json({ message: "fetch user count", userCount: userscount });
    } catch (error) {
      next(error);
    }
  };
  onGetChannelsCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const channelCount = await this._interactor.getChannelsCount();
      if (!channelCount) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Can't find the channelcount" });
      }
      // console.log('channelcount',channelCount);
      res
        .status(ResponseStatus.Accepted)
        .json({ message: "fetch user count", channelCount });
    } catch (error) {
      next(error);
    }
  };
  onInsertSubscriptionPlan = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "No plan Data Provided" });
      }
      const plan = {
        month: req.body.month ? req.body.month.trim() : null,
        price: req.body.price ? req.body.price.trim() : null,
      };
      console.log(req.body);
      console.log(plan);
      if (!plan.price || !plan.month) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "month or plan is required" });
      }
      console.log("here the plan", req.body);
      const newplan = await this._interactor.insertSubscription(req.body);
      if (!newplan) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error while interting the newplan" });
      }
      res.status(ResponseStatus.Created).json({ message: "Inserted", newplan });
    } catch (error) {
      next(error);
    }
  };
  onGetAllPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = await this._interactor.getAllPlan();
      if (!plans) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error findding plan" });
      }
      res
        .status(ResponseStatus.OK)
        .json({ message: "plan fetched", plan: plans });
    } catch (error) {
      next(error);
    }
  };
  addChannelSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "No plan Data Provided" });
      }
      const plan = {
        month: req.body.month ? req.body.month.trim() : null,
        price: req.body.price ? req.body.price.trim() : null,
      };
      console.log(req.body);
      console.log(plan);
      if (!plan.price || !plan.month) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "month or plan is required" });
      }
      console.log("here the plan", req.body);
      const newplan = await this._interactor.addChannelSubscription(req.body);
      console.log(newplan, "yes");
      if (!newplan) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error while interting the newplan" });
      }
      res
        .status(ResponseStatus.Created)
        .json({ message: "Inserted", plan: newplan });
    } catch (error) {
      console.error("Server error:", error);
      next(error);
    }
  };
  onGetAllChannelplans = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const plans = await this._interactor.getAllChannelPlan();
      if (!plans) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error findding plan" });
      }
      res
        .status(ResponseStatus.OK)
        .json({ message: "plan fetched", plan: plans });
    } catch (error) {
      next(error);
    }
  };
  onGetMembership = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this._interactor.fetchMembership();
      if (!response) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error findding membership" });
      }
      res
        .status(ResponseStatus.OK)
        .json({
          message: "plan fetched",
          members: response.member,
          wallet: response.wallet,
        });
    } catch (error) {
      next(error);
    }
  };
  onGetDashboardData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this._interactor.fetchDashboardData();
      if (!response) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error findding dashboarddata" });
      }
      res
        .status(ResponseStatus.OK)
        .json({
          message: "plan fetched",
          monthlySubscription:response.monthlySubscription,
          individualPlanSubscriptions:response.individualPlanSubscriptions
        });
    } catch (error) {
      next(error);
    }
  };
}
