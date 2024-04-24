import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../repositories/UserRepository';
import { UserInteractor } from '../interactors/UserInteractor';
const router = Router();


const repository = new UserRepository()
const interactor=new UserInteractor(repository)
const controller=new UserController(interactor)

router.post('/loginuser',controller.onlogin.bind(controller)) 
router.post('/signup',controller.onsignup.bind(controller))
router.post('/otpverify',controller.oncheckotp.bind(controller))
router.post('/resendotp',controller.resendotp.bind(controller))
export default router;
