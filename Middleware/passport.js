import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userModel from '../Models/Usermodel.js';
import dotenv from 'dotenv'
dotenv.config()
const secretkey=process.env.SECRET_KEY;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretkey
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    console.log(jwtPayload)
    const user = await userModel.findOne({email:jwtPayload.user});

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

export default passport