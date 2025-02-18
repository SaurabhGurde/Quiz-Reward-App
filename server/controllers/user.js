import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import db from "../db/db.js";
import { Prisma } from "@prisma/client";
dotenv.config();
var jwtSecret = process.env.JWTSECRET;

function generateReferralCode(length = 7) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let referralCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }

  return referralCode;
}
const getUniqueReferralCode = async () => {
  let isUnique = false;
  let referralCode;

  while (!isUnique) {
    referralCode = generateReferralCode();
    const existingCode = await db.user.findUnique({
      where: { referalCode: referralCode },
    });
    if (!existingCode) {
      isUnique = true;
    }
  }

  return referralCode;
};

export const signUpUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dob,
      partnerReferalCode,
    } = req.body;

    if (!firstName && !email && !password && !phone && !dob && !lastName) {
      return res.status(401).json({ errorMsg: "All fields are required" });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(401).json({ errorMsg: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(5);
    const securePass = await bcrypt.hash(password, salt);

    let referringUser = null;
    let reward = 0;

    if (partnerReferalCode) {
      referringUser = await db.user.findUnique({
        where: { referalCode: partnerReferalCode },
      });

      if (!referringUser) {
        return res.status(401).json({ errorMsg: "Invalid referral code" });
      }
    }

    const uniqueReferralCode = await getUniqueReferralCode();

    let newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        password: securePass,
        dob,
        partnerReferalCode,
        referalCode: uniqueReferralCode,
        reward: referringUser ? 400 : 200,
      },
    });

    if (referringUser) {
      await db.user.update({
        where: { id: referringUser.id },
        data: {
          reward: referringUser.reward + 200,
        },
      });
    }

    const authToken = jwt.sign({ userId: newUser.id }, jwtSecret);
    delete newUser.password;
    newUser = {
      ...newUser,
      authToken
    }
    return res.status(200).json({ success: true, authToken, newUser });
  } catch (error) {
    console.error(error.message);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res
          .status(401)
          .json({ errorMsg: "Email or phone already in use" });
      }
    }

    return res.status(500).json({ errorMsg: "Server error" });
  }
};

export const logInUser = async (req, res) => {
  let success = false;

  const { email, password } = req.body;
  console.log(email);
  if (!email && !password) {
    return res.status(401).json({ success, errorMsg: "Enter all credentials" });
  }
  try {
    let user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({ success, errorMsg: "Account not found" });
    }

    const pwdCompare = await bcrypt.compare(password, user.password);
    if (!pwdCompare) {
      return res.status(401).json({ success, errorMsg: "Wrong password" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };
    success = true;

    const authToken = jwt.sign(data, jwtSecret);
    delete user.password;
    user = {
      ...user,
      authToken
    }
    return res.status(200).json({ success, authToken, user });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success, errorMsg: "Server error" });
  }
};
