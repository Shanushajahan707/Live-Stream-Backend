import { Router } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { UserInteractor } from "../interactors/UserInteractor";
import passport from "passport";
import authMiddleware from "../middleware/authMiddleware";
import blockCheckMiddleware from "../middleware/blockMIddleware";
import { UserController } from "../controllers/user";

const router = Router();

// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new UserRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new UserInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new UserController(interactor);


router.get('/test',controller.test.bind(controller))
//ackowledment
router.get('/ack',controller.ack.bind(controller))
// Calls the onLogin method of the UserController instance to handle the login process.
router.post("/loginuser", controller.onLogin.bind(controller));
//forgot poassword route
router.post("/forgoturl", controller.onSendUrl.bind(controller));
//forgot password otp sent
router.post("/forgotpasswordotp", controller.onSendOtpCheck.bind(controller));
//
router.put("/changepassword", controller.onChangePassword.bind(controller));
//call the onsignup method of the Usercontroller instance to handle the signup process
router.post("/signup", controller.onSignup.bind(controller));
//call the mehtod to handle otp post
router.post("/otpverify", controller.onCheckOtp.bind(controller));
//call the method to handel the resend otp
router.post("/resendotp", controller.resendOtp.bind(controller));
router.post("/refreshtoken", controller.refreshToken.bind(controller));
//tesing route
// router.post("/test", authMiddleware, controller.test.bind(controller));
//google auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
//callback google auth with values
router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  controller.googleCallback.bind(controller)
);

router.get(
  "/userisblocked",
  authMiddleware,
  controller.userIsBlocked.bind(controller)
);

router.get(
  "/getallsubscription",
  authMiddleware,
  blockCheckMiddleware,
  controller.onGetAllSubscription.bind(controller)
);
router.get(
  "/getallchannelsubscription",
  authMiddleware,
  blockCheckMiddleware,
  controller.onGetAllChannelSubscription.bind(controller)
);
router.post(
  "/websitesubscription",
  authMiddleware,
  blockCheckMiddleware,
  controller.onSubscribeWebsite.bind(controller)
);
router.get(
  "/istrailover",
  authMiddleware,
  blockCheckMiddleware,
  controller.isTrailOver.bind(controller)
);

export default router;
