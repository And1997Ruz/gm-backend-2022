import express, { Request, Response, NextFunction } from "express";
import Item from "../models/Item";
import User from "../models/User";
import Category from "../models/Category";
import fs from "fs";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getItem, (req: Request, res: Response) => {
  const item = res.item;
  res.status(200).json(item);
});

router.post("/", async (req: Request, res: Response) => {
  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(400).json({ message: "User id is invalid" });
  }
  const category = await Category.findById(req.body.categoryId);

  let newItem = new Item({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    seller: user,
    category: category
      ? category
      : await Category.findOne({ name: "Остальные" }),
    dateOfPost: req.body.dateOfPost,
  });
  try {
    newItem = await newItem.save();
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getItem, async (req: Request, res: Response) => {
  let category;
  if (req.body.categoryId) {
    category = await Category.findOne({ _id: req.body.categoryId });
    res.item.category = category;
  }
  if (req.body.name) {
    res.item.name = req.body.name;
  }
  if (req.body.description) {
    res.item.description = req.body.description;
  }
  if (req.body.price) {
    res.item.price = req.body.price;
  }
  try {
    let updatedItem = await res.item.save();
    res.status(200).json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", getItem, async (req: Request, res: Response) => {
  try {
    const itemPictures = res.item.itemPicture;
    if (itemPictures.length > 0) {
      try {
        itemPictures.forEach((path: string) => {
          fs.unlinkSync(path.substring(1));
        });
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    }
    await res.item.remove();
    res.status(200).json({ message: "Item was removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

async function getItem(req: Request, res: Response, next: NextFunction) {
  let item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Item was not found" });
  }
  res.item = item;
  next();
}

export default router;
