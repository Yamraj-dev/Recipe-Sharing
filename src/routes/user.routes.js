import express from "express";
import { Register, Login, LogOut } from "../controller/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/register").post(upload.single("img"), Register);

router.route("/login").post(Login);

router.route("/logout").post(LogOut);


export default router;