import express from "express";
// import { Register, Login, LogOut } from "../controller/user.controller.js";
import { Register, Login, LogOut } from "../controller/user.controller.js"
import upload from "../middleware/multer.middleware.js";
import { verifyjwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", upload.single("img"), Register);

// proctected routes
router.post("/login", Login);
router.post("/logout", verifyjwt, LogOut);


export default router;