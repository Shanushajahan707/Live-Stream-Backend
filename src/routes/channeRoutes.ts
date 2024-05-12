import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware";
import { ChannelController } from "../controllers/channelController";
import { channelRepository } from "../repositories/ChannelRepository";
import { channelInteractor } from "../interactors/ChannelInteractor";
import { upload } from "../utils/multer";

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
// router.get('/isfollow',authMiddleware,
  
// )

export default router;
