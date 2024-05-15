import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { UserRepository } from "../repositories/UserRepository";
import { UserInteractor } from "../interactors/UserInteractor";
import { googleUser } from "../entities/User";
dotenv.config();

const repository = new UserRepository();
const interactor = new UserInteractor(repository);

type User = {
  _id?: string;
};

passport.serializeUser((user: User, done) => {
  if (user) {
    done(null, user._id);
  } else {
    done(new Error("User ID is undefined"));
  }
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await interactor.googleFindById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user;
        if (profile._json && profile._json.email) {
          const email = profile._json.email;
          user = await interactor.googleFindOne(email);
        } else {
          console.log("Email is undefined in profile._json");
        }
        if (user) {
          done(null, user);
        } else {
          const newUserData = new googleUser(
            profile.id,
            profile.displayName,
            profile.emails?.[0]?.value ?? "default@email.com",
            new Date('2000-01-01'),
            'user'
          );
          const newUser = await interactor.googleUserCreation(newUserData);
          if (newUser) {
            done(null, newUser);
          } else {
            done(new Error("Failed to create user"));
          }
        }
      } catch (error) {
        done(error as Error);
      }
    }
  )
);
