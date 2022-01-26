import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

type FileNameCallback = (error: Error | null, filename: string) => void;

const itemPictureStorage = multer.diskStorage({
  destination: "uploads/itemPictures",
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, Math.round(Date.now() / 1000000) + file.originalname);
  },
});

const profilePictureStorage = multer.diskStorage({
  destination: "uploads/profilePictures",
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, Math.round(Date.now() / 1000000) + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/JFIF"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadItemPicture = multer({
  storage: itemPictureStorage,
  fileFilter: fileFilter,
});

export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: fileFilter,
});
