
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from "./routes/user.js";
import questionRouter from "./routes/questions.js";
import rewardRouter from "./routes/rewards.js";

const app = express();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use("/user", userRouter);
app.use("/questions", questionRouter);
app.use("/rewards", rewardRouter);

//Replace Connection_URL with own one changing password and username to match
const CONNECTION_URL = 'mongodb+srv://<username>:<password>@cluster0.2s0pn.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);