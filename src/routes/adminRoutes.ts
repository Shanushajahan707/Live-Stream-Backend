import { Router } from "express";
import { AdminRepository } from "../repositories/AdminRepository";
import { AdminInteractor } from "../interactors/AdminInteractor";
import { AdminController } from "../controllers/adminController";

const router = Router();

const repository = new AdminRepository();
const interactor = new AdminInteractor(repository);
const controller = new AdminController(interactor);

router.get("/getusers", controller.onGetUser.bind(controller));
router.put("/blockuser/:id", controller.onBlockUser.bind(controller));
router.get("/getchannels", controller.onGetFullChannels.bind(controller));
router.put("/blockchannel/:id", controller.onBlockChannel.bind(controller));
router.get(
  "/getUserProfileAdmin/:userid",
  controller.onGetUserProfile.bind(controller)
);
router.get("/getuserscount", controller.onGetUsersCount.bind(controller));
router.get("/getchannelscount", controller.onGetChannelsCount.bind(controller));
router.post(
  "/insertsubscription",
  controller.onInsertSubscriptionPlan.bind(controller)
);
router.get("/getallplan", controller.onGetAllPlan.bind(controller));
router.post(
  "/addsubscription",
  controller.addChannelSubscription.bind(controller)
);
router.get(
  "/getallchannelsubscription",
  controller.onGetAllChannelplans.bind(controller)
);
router.get(
  "/fetchmembership",
  controller.onGetMembership.bind(controller)
);
router.get(
  "/getdashboarddata",
  controller.onGetDashboardData.bind(controller)
);
export default router;
