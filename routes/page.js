import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "내 정보 - 짹짹이" });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - 짹짹이" });
});

router.get("/", (req, res, next) => {
  const twits = [];
  res.render("main", { title: "짹짹이", twits });
});

export default router;
