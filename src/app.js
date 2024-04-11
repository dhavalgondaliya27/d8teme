import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import {
  facebookPassport,
  googlePassport,
} from "./controllers/user.controller.js";
const app = express();
app.use(
  session({
    secret: "bhavinkarena",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.get("/", (req, res) => {
  res.send("D8teme");
});
googlePassport(passport);
facebookPassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://d8teme-752t.onrender.com",
      "https://d8tome.vercel.app",
      "https://d8teme.onrender.com",
      "https://d8teme.onrender.com/",
      "https://d8teme.onrender.com/api/v1/google",
      "https://d8teme.onrender.com/api/v1/google/callback",
      "https://d8teme-752t.onrender.com/",
      "https://accounts.google.com",
      "https://accounts.google.com/o/oauth2/v2/auth",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
//user routes import
import UserRouter from "./routes/user.route.js";
app.use("/api/v1", UserRouter);
//userProfile routes import
import userprofileRouter from "./routes/userprofile.route.js";
app.use("/api/v2", userprofileRouter);
//hashtag route import
import hashRouter from "./routes/hashtag.route.js";
app.use("/api/v3", hashRouter);
//request route import
import requestRouter from "./routes/usermatch.route.js";
app.use("/api/v4", requestRouter);
//post route import
import postRouter from "./routes/post.route.js";
app.use("/api/v5", postRouter);
//comment route import
import commentRouter from "./routes/comment.routes.js";
app.use("/api/v6", commentRouter);
export { app };