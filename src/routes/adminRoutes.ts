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
router.get("/getUserProfileAdmin/:userid", controller.onGetUserProfile.bind(controller));

export default router;
