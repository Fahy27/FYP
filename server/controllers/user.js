import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body
  try {
    const oldUser = await UserModel.findOne({ email });
    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export async function getCurrentUserData(req, res) {
  if(!req.userId) {
    res.sendStatus(401)
    return
  }
  try {
    const user = await UserModel.findById(req.userId)
    res.status(200).json(user)
  } catch(err) {
    console.log(err)
    res.sendStatus(500)
  }
}

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserModel.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, currency: 0, points: 0 });
    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export async function getLeaderboard(req, res) {
  try {
    const leaderboard = await UserModel.find().select({name: 1, points: 1}).sort({points: -1}).limit(10)
    res.status(200).json(leaderboard)
  } catch(err) {
    console.log(err)
    res.sendStatus(500)
  }
}