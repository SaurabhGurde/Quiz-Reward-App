import express from 'express';
import { logInUser, signUpUser } from '../controllers/user.js';

const userRoute = express.Router();

userRoute.post("/signup", signUpUser )
userRoute.post("/login", logInUser)

export default userRoute