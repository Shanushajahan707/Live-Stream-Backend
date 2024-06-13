import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User"; // Ensure you have a User model/entity
import { UserModel } from "../model/userModel"; // Ensure the user model is correctly imported
import { ResponseStatus } from "../constants/statusCodeEnums";

const blockCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;

    if (!user._id) {
      return res
        .status(ResponseStatus.BadRequest)
        .json({ message: "Invalid user ID" });
    }

    const foundUser = await UserModel.findOne({ _id: user._id });

    if (!foundUser) {
      return res
        .status(ResponseStatus.BadRequest)
        .json({ message: "User not found" });
    }

    if (foundUser.isblocked) {
      console.log("user blocked");
      return res
        .status(ResponseStatus.BadRequest)
        .json({ message: "User is blocked" });
    }

    next();
  } catch (error) {
    console.error("Error in blockCheckMiddleware:", error);
    throw error;
  }
};

export default blockCheckMiddleware;
