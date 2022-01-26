import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
import compression from "compression";

import CategoryRouter from "./routes/categories";
import ItemRouter from "./routes/items";
import UserRouter from "./routes/users";
import AuthRouter from "./routes/auth";
import UploadRouter from "./routes/upload";
import DeleteFileRouter from "./routes/deleteItemFile";
import DeleteAvatarRouter from "./routes/deleteAvatar";

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(compression());

app.use("/api/categories", CategoryRouter);
app.use("/api/items", ItemRouter);
app.use("/api/users", UserRouter);
app.use("/api/login", AuthRouter);
app.use("/api/upload", UploadRouter);
app.use("/api/deleteFile", DeleteFileRouter);
app.use("/api/deleteAvatar", DeleteAvatarRouter);

mongoose.connect(process.env.DATABASE_URL as string);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("DB is connected"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is up");
});
