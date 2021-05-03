import passport from "passport";
import KakaoStrategy from "passport-kakao";

import User from "../models/user.js";

const kakaoLoginCb = async (accessToken, refreshToken, profile, done) => {
  console.log("Kakao profile: ", profile);
  try {
    const user = await User.findOne({
      where: { snsId: profile.id, provider: "kakao" },
    });
    if (user) {
      done(null, user);
    } else {
      const newUser = await User.create({
        email: profile._json?.kakao_account_email,
        nick: profile.displayName,
        snsId: profile.id,
        provider: "kakao",
      });
      done(null, newUser);
    }
  } catch (error) {
    console.error(error);
    done(error);
  }
};

export default () => {
  passport.use(
    new KakaoStrategy.Strategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      kakaoLoginCb
    )
  );
};
