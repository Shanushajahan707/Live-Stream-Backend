import { Router } from "express";
import { LiveRepository } from "../repositories/LIveRepository";
import { LiveInteractor } from "../interactors/LiveInteractor";
import { LiveController } from "../controllers/liveController";
import authMiddleware from "../middleware/authMiddleware";
import blockCheckMiddleware from "../middleware/blockMIddleware";
// import { AdminRepository } from "../repositories/AdminRepository";
// import { AdminInteractor } from "../interactors/AdminInteractor";
// import { AdminController } from "../controllers/adminController";

const router = Router();

const repository = new LiveRepository();
const interactor = new LiveInteractor(repository);
const controller = new LiveController(interactor);


router.get('/getchannel',authMiddleware,blockCheckMiddleware,controller.onGetChannel.bind(controller))
router.put('/updatestartliveinfo/:roomId',authMiddleware,blockCheckMiddleware,controller.onUpdateStartLiveInfo.bind(controller))
router.put('/updatestopliveinfo',authMiddleware,blockCheckMiddleware,controller.onUpdateStopLiveInfo.bind(controller))
router.get('/recommendedlives',authMiddleware,blockCheckMiddleware,controller.onGetReconmmendedLives.bind(controller))


export default router;
