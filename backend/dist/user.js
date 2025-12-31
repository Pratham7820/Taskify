"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
require("dotenv/config");
const user = express_1.default.Router();
const signinBody = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string()
});
user.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseBody = signinBody.safeParse(req.body);
    if (parseBody.error) {
        return res.status(403).json({
            message: 'user data not valid'
        });
    }
    const { email, password } = req.body;
    const user = yield db_1.UserModel.findOne({
        email,
        password
    });
    if (!user) {
        return res.status(403).json({
            message: 'user does not exist'
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || '');
    res.json({
        message: 'user login successfully',
        token: token
    });
}));
const signupBody = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string(),
    username: zod_1.default.string()
});
user.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseBody = signupBody.safeParse(req.body);
    if (parseBody.error) {
        return res.status(403).json({
            message: 'user data not valid'
        });
    }
    const { email, username, password } = req.body;
    const alreadyExist = yield db_1.UserModel.findOne({
        email,
        password
    });
    if (alreadyExist) {
        return res.status(403).json({
            message: 'user already exist'
        });
    }
    const user = yield db_1.UserModel.create({
        username,
        password,
        email
    });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || '');
    res.json({
        message: 'user signup successfully',
        token: token
    });
}));
exports.default = user;
