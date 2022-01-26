import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Joi from "joi";

const router = express();

router.post("/", async (req: Request, res: Response) => {
  const { error } = await authSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ message: "Неверный пароль или адрес эл.почты" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res
      .status(400)
      .json({ message: "Неверный пароль или адрес эл.почты" });

  const token = user.generateAuthToken();
  res.send(token);
});

const authSchema = Joi.object({
  email: Joi.string().min(5).max(30).email().lowercase().required(),
  password: Joi.string().min(5).max(15).max(250).required(),
});

export default router;
