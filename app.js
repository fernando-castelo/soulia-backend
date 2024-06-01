const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const conversationRouter = require('./routes/conversationRoutes');

const app = express();

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }));
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/conversations', conversationRouter);

module.exports = app;
