import Sequelize from "sequelize";
import confJson from "../config/config.js";
import User from "./user.js";
import Post from "./post.js";
import Hashtag from "./hashtag.js";

const env = process.env.NODE_ENV || "development";
const config = confJson[env];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = { sequelize, User, Post, Hashtag };
User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

export { db };
export default sequelize;
