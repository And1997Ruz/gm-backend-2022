"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
exports.UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
    },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 15,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30,
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 250,
        required: true,
    },
    userPicture: {
        type: String,
        default: "",
    },
});
exports.UserSchema.methods.generateAuthToken = function () {
    return jsonwebtoken_1.default.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY);
};
exports.default = mongoose_1.default.model("user", exports.UserSchema);
