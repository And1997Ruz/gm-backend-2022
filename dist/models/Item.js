"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var User_1 = require("../models/User");
var Category_1 = require("../models/Category");
var ItemSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 1000,
    },
    price: {
        type: String,
        required: true,
    },
    seller: {
        type: User_1.UserSchema,
        required: true,
    },
    category: {
        type: Category_1.CategorySchema,
        required: true,
    },
    dateOfPost: {
        type: String,
        default: function () {
            var date = new Date().toLocaleDateString("ru-RU");
            return date;
        },
    },
    itemPicture: {
        type: [String],
        default: [],
    },
});
exports.default = mongoose_1.default.model("item", ItemSchema);
