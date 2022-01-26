import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import _ from "lodash";
import Joi from "joi";
import User from "../models/User";
import fs from "fs";
import Item from "../models/Item";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getUser, (req: Request, res: Response) => {
  const user = res.user;
  res.status(200).json(user);
});

router.post("/", validateUser, async (req: Request, res: Response) => {
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      message: "Пользователь с данным адресом эл.почты уже зарегистрирован",
    });

  if (!req.body.password)
    return res.status(400).json({ message: "Password is required" });

  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(req.body.password, salt);

  let newUser = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    newUser = await newUser.save();

    const token = newUser.generateAuthToken();

    res
      .status(201)
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .json(_.pick(newUser, ["_id", "name", "email", "phone"]));
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getUser, async (req: Request, res: Response) => {
  if (req.body.name) {
    res.user.name = req.body.name;
  }
  if (req.body.phone) {
    res.user.phone = req.body.phone;
  }
  if (req.body.email) {
    res.user.email = req.body.email;
  }
  if (req.body.password) {
    res.user.password = await bcrypt.hash(req.body.password, 10);
  }
  try {
    let updatedUser = await res.user.save();
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", getUser, async (req: Request, res: Response) => {
  const items = await Item.find({ seller: res.user });
  if (items.length > 0) {
    try {
      items.forEach(async (item) => {
        const itemPictures = item.itemPicture;
        if (itemPictures.length > 0) {
          try {
            itemPictures.forEach((path: string) => {
              fs.unlinkSync(path.substring(1));
            });
          } catch (error: any) {
            return res.status(400).json({ message: error.message });
          }
        }
        await item.remove();
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  const userPicture = res.user.userPicture;
  if (userPicture) {
    try {
      fs.unlinkSync(userPicture.substring(1));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  try {
    await res.user.remove();
    res.status(200).json({ message: "User was removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

async function getUser(req: Request, res: Response, next: NextFunction) {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User was not found" });
  }
  res.user = user;
  next();
}

const authSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  phone: Joi.string().min(8).max(15).required(),
  email: Joi.string().min(5).max(30).email().lowercase().required(),
  password: Joi.string().min(5).max(250).required(),
});

async function validateUser(req: Request, res: Response, next: NextFunction) {
  const { error } = await authSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
}

export default router;
