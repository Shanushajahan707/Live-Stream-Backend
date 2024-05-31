import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware";
import { ChannelController } from "../controllers/channelController";
import { channelRepository } from "../repositories/ChannelRepository";
import { channelInteractor } from "../interactors/ChannelInteractor";
import { upload } from "../utils/imageMulter";
import singleVideoUpload from "../utils/videoMulter";

const router = Router();

const repository = new channelRepository();
const interactor = new channelInteractor(repository);
const controller = new ChannelController(interactor);

router.get(
  "/getchannel",
  authMiddleware,
  controller.onGetChannels.bind(controller)
);
router.post(
  "/updatechannel",
  authMiddleware,
  upload,
  controller.onEditChannel.bind(controller)
);
router.get(
  "/recommendedchannels",
  authMiddleware,
  controller.onGetRecommendedChannel.bind(controller)
);
router.post(
  "/followchannel",
  authMiddleware,
  controller.onFollowChannel.bind(controller)
);
router.post(
  "/unfollowchannel",
  authMiddleware,
  controller.onUnFollowChannel.bind(controller)
);
router.get(
  "/getfullfollowchannel",
  authMiddleware,
  controller.onGetFullFollowChannels.bind(controller)
);
router.get(
  "/getfollowchannel/:channelId",
  authMiddleware,
  controller.onGetFollowChannel.bind(controller)
);
router.post(
  "/uploadshorts/:channelId",
  singleVideoUpload.single('videoFile'),
  authMiddleware,
  controller.onUploadShorts.bind(controller)
);
// router.get('/isfollow',authMiddleware,
  
// )

export default router;
