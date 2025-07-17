import express from "express";
// import { Register, Login, LogOut } from "../controller/user.controller.js";
import { Register, Login, LogOut, refreshAccessToken, UpdateImg, ChangePassword, GetCurrentUSer } from "../controller/user.controller.js"
import upload from "../middleware/multer.middleware.js";
import { verifyjwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", upload.single("img"), Register);
router.post("/login", Login);

// proctected routes

router.post("/logout", verifyjwt, LogOut);
router.post("/refresh-token", refreshAccessToken);
router.get("/get-user", verifyjwt, GetCurrentUSer)
router.post("/change-password", verifyjwt, ChangePassword);
router.post("/change-img", verifyjwt, upload.single("img"), UpdateImg);

export default router;