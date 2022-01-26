import express, { Request, Response } from "express";
import fs from "fs";
import User from "../models/User";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  let user;
  if (!req.body.userId) {
    return res.status(400).json({ message: "Missing User ID" });
  }
  try {
    const path = req.body.filePath.substring(1);
    if (req.body.userId) {
      user = await User.findOne({ _id: req.body.userId });
      if (!user) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
      user.userPicture = "";
      await user.save();
    }
    fs.unlinkSync(path);
    res.status(200).json({ message: "File was successfully deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
