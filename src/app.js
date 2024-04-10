import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { facebookPassport, googlePassport } from './controllers/user.controller.js';
const app = express();
app.get('/', (req, res) => {
  res.send('D8teme');
});
googlePassport(passport);
facebookPassport(passport);
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: ['http://localhost:3000',],
    credentials: true,
  })
);
// app.use((req, res, next) => {
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow requests from any origin
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specified HTTP methods
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
//   next();
// });
app.use(
  session({
    secret: 'Dhaval Gondaliya',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//user routes import
import UserRouter from './routes/user.route.js';
import hashRouter from './routes/hashtag.route.js';
import requestRouter from './routes/usermatch.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.routes.js';
import userprofileRouter from './routes/userprofile.route.js';

app.use('/api/v1', UserRouter);
//hashtag route import

app.use('/api/v3', hashRouter);
//request route import

app.use('/api/v4', requestRouter);
//post route import

app.use('/api/v5', postRouter);
//comment route import

app.use('/api/v6', commentRouter);


app.use('/api/v2', userprofileRouter);
export { app };
