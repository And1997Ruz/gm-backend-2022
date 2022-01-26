import express, { Request, Response } from "express";
import fs from "fs";
import Item from "../models/Item";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  let item;
  if (!req.body.itemId) {
    return res.status(400).json({ message: "Missing item ID" });
  }
  try {
    const path = req.body.filePath.substring(1);
    if (req.body.itemId) {
      item = await Item.findOne({ _id: req.body.itemId });
      if (!item) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      const pictureArray = item.itemPicture;
      const newPictureArray = pictureArray.filter(
        (path: string) => path !== req.body.filePath
      );
      item.itemPicture = newPictureArray;
      await item.save();
    }
    fs.unlinkSync(path);
    res.status(200).json({ message: "File was successfully deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
