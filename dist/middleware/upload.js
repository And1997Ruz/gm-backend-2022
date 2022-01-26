"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePicture = exports.uploadItemPicture = void 0;
var multer_1 = __importDefault(require("multer"));
var itemPictureStorage = multer_1.default.diskStorage({
    destination: "uploads/itemPictures",
    filename: function (req, file, cb) {
        cb(null, Math.round(Date.now() / 1000000) + file.originalname);
    },
});
var profilePictureStorage = multer_1.default.diskStorage({
    destination: "uploads/profilePictures",
    filename: function (req, file, cb) {
        cb(null, Math.round(Date.now() / 1000000) + file.originalname);
    },
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/JFIF") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.uploadItemPicture = (0, multer_1.default)({
    storage: itemPictureStorage,
    fileFilter: fileFilter,
});
exports.uploadProfilePicture = (0, multer_1.default)({
    storage: profilePictureStorage,
    fileFilter: fileFilter,
});
