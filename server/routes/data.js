import express from 'express';
import { getLeaderBoardData, handleDailyUserbonus } from '../controllers/data.js';

const data = express.Router();

data.post("/getLeaderBoardData", getLeaderBoardData )
data.post("/handleDailyUserbonus", handleDailyUserbonus )

export default data