import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware";
import { ChannelController } from "../controllers/channelController";
import { channelRepository } from "../repositories/ChannelRepository";
import { channelInteractor } from "../interactors/ChannelInteractor";
import { upload } from "../utils/imageMulter";
import singleVideoUpload from "../utils/videoMulter";
import blockCheckMiddleware from "../middleware/blockMIddleware";

const router = Router();

const repository = new channelRepository();
const interactor = new channelInteractor(repository);
const controller = new ChannelController(interactor);

router.get(
  "/getchannel",
  authMiddleware,
  blockCheckMiddleware,
  controller.onGetChannels.bind(controller)
);
router.post(
  "/updatechannel",
  authMiddleware,
  blockCheckMiddleware,
  upload,
  controller.onEditChannel.bind(controller)
);
router.get(
  "/recommendedchannels",
  authMiddleware,
  blockCheckMiddleware,
  controller.onGetRecommendedChannel.bind(controller)
);
router.post(
  "/followchannel",
  authMiddleware,
  blockCheckMiddleware,
  controller.onFollowChannel.bind(controller)
);
router.post(
  "/unfollowchannel",
  authMiddleware,
  blockCheckMiddleware,
  controller.onUnFollowChannel.bind(controller)
);
router.get(
  "/getfullfollowchannel",
  authMiddleware,
  blockCheckMiddleware,
  controller.onGetFullFollowChannels.bind(controller)
);
router.get(
  "/getfollowchannel/:channelId",
  authMiddleware,
  blockCheckMiddleware,
  controller.onGetFollowChannel.bind(controller)
);
router.post(
  "/uploadshorts/:channelId",
  authMiddleware,
  blockCheckMiddleware,
  singleVideoUpload.single("videoFile"),
  controller.onUploadShorts.bind(controller)
);
router.put(
  "/updateviews/:channelId",
  authMiddleware,
  blockCheckMiddleware,
  singleVideoUpload.single("videoFile"),
  controller.onUpdateViews.bind(controller)
);

router.post(
  "/searchchannel",
  authMiddleware,
  blockCheckMiddleware,
  controller.onSearchChannel.bind(controller)
);

router.get(
  "/ismember/:channelId",
  authMiddleware,
  blockCheckMiddleware,
  controller.onIsMember.bind(controller)
);

router.post(
  "/channelsubscribe",
  authMiddleware,
  blockCheckMiddleware,
  controller.onSubscribeChannel.bind(controller)
);
router.get(
  "/getsubscribedmembers",
  authMiddleware,
  blockCheckMiddleware,
  controller.onGetAllSubscribedMemebers.bind(controller)
);
router.get(
  "/getrevenuechart",
  authMiddleware,
  blockCheckMiddleware,
  controller.onFetchRevenueChart.bind(controller)
);
router.get(
  "/revenue-chart",
  authMiddleware,
  blockCheckMiddleware,
  controller.onFetchExcelData.bind(controller)
);



export default router;
