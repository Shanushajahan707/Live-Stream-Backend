// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { UserRepository } from '../repositories/UserRepository';
// import { GoogleOAuthUseCase } from '../usercase/GoogleOAuthUseCase';
// import dotenv from 'dotenv';

// dotenv.config();


// // Assuming UserRepository and GoogleOAuthUseCase are correctly implemented
// const userRepository = new UserRepository();
// const googleOAuthUseCase = new GoogleOAuthUseCase(userRepository);

// passport.use(
//  new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID as string,
//       clientSecret: process.env.CLIENT_SECRET as string,
//       callbackURL: "/auth/google/redirect",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = await googleOAuthUseCase.execute(accessToken, refreshToken, profile);
//         done(null, user);
//       } catch (error) {
//         done(error as Error);
//       }
//     }
//  )
// );