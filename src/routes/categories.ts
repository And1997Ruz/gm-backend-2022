import express, { Request, Response, NextFunction } from "express";
import Category from "../models/Category";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort("name");

    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getCategory, (req, res) => {
  const category = res.category;
  res.status(200).json(category);
});

router.post("/", async (req, res) => {
  let newCategory = new Category({
    name: req.body.iconPath,
    iconPath: req.body.iconPath,
  });
  try {
    newCategory = await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getCategory, async (req: Request, res: Response) => {
  if (req.body.name) {
    res.category.name = req.body.name;
  }

  try {
    let updatedCategory = await res.category.save();
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", getCategory, async (req: Request, res: Response) => {
  try {
    await res.category.remove();
    res.status(200).json({ message: "Category was removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

async function getCategory(req: Request, res: Response, next: NextFunction) {
  const category = await Category.findById(req.params.id);
  if (!category)
    return res.status(404).json({ message: "Category was not found" });
  res.category = category;

  next();
}

export default router;
