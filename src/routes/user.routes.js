import express from "express";
import { Register, Login, LogOut } from "../controller/user.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/register").post(upload.field({name: "img", maxCount: 1}), Register);
router.route("/login").post(Login);
router.route("logout").post(LogOut);