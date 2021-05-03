import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

import User from "../models/user.js";

const localLoginCb = async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      (await bcrypt.compare(password, user.password))
        ? done(null, user)
        : done(null, false, { message: "패스워드 불일치" });
    } else {
      done(null, false, { message: "존재하지 않는 유저" });
    }
  } catch (error) {
    console.error(error);
    done(error);
  }
};

export default () => {
  passport.use(
    new LocalStrategy.Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      localLoginCb
    )
  );
};
