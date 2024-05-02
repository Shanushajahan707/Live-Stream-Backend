import { Request, Response, NextFunction } from "express";
import { IAdminInteractor } from "../providers/interfaces/IAdminInteractor";

enum ResponseStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
}

export class AdminController {
  private _interactor: IAdminInteractor;
  constructor(interactor: IAdminInteractor) {
    this._interactor = interactor;
  }

  onGetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this._interactor.getUsers();
      if (users) {
        return res
          .status(ResponseStatus.OK)
          .json({ message: "Successfully get all the users", users });
      }
      console.log("users", users);
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
          .json({ message: "Successfully Updated",user:status.user });
      } else {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Error toggling user status" });
      }
    } catch (error) {
      next(error);
    }
  };
}
