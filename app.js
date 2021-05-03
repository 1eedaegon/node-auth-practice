import express from "express";
import cookie from "cookie-parser";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import nunjucks from "nunjucks";
import dotenv from "dotenv";
import passport from "passport";

import pageRouter from "./routes/page.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import userRouter from "./routes/user.js";
import sequelize from "./models/index.js";
import passportConfig from "./passport/index.js";

dotenv.config();
const __dirname = path.resolve();
passportConfig();

const app = express();
// PORT
app.set("port", process.env.PORT || 8001);
// VIEW ENGINE
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
// DATABASE
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.error(err);
  });
// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

export default app;
