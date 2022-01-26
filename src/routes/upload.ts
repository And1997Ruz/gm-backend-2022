import express, { Request, Response, NextFunction } from "express";
import { uploadItemPicture, uploadProfilePicture } from "../middleware/upload";
import Item from "../models/Item";
import User from "../models/User";

const router = express.Router();

router.post(
  "/item",
  uploadItemPicture.array("file"),
  async (req: Request, res: Response) => {
    try {
      if (Array.isArray(req.files) && req.files.length > 0) {
        try {
          const files = req.files;
          const id = req.headers.itemid;
          const item = await Item.findById(id);
          files.forEach((picture, idx) => {
            item.itemPicture.push(
              `/uploads/itemPictures/${
                Math.round(Date.now() / 1000000) + files[idx].originalname
              }`
            );
          });

          await item.save();
          res.status(200).json({ message: "File was uploaded" });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.status(400).json({ message: "Unsupported file format" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

//Uploading profile pictures
router.post(
  "/profile",
  uploadProfilePicture.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (req.file) {
        try {
          const id = req.headers.userid;
          const user = await User.findById(id);
          user.userPicture = `/uploads/profilePictures/${
            Math.round(Date.now() / 1000000) + req.file.originalname
          }`;
          await user.save();
          res.status(200).json({ message: "File was uploaded" });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.status(400).json({ message: "Unsupported file format" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

export default router;
