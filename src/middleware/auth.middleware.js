import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import ApiError from "../util/ApiError.js";
import asyncHandler from "../util/asyncHandler.js";

export const verifyjwt = asyncHandler( async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");

        if(!token) {
            throw new ApiError(400, "Unathorized request");
        }

        const decodeToken = jwt.verify(token, process.env.Access_Token);

        const user = await User.find(decodeToken?._id).select("-password -refreshToken")

        if(!user) {
            throw new ApiError(400, "Invalid access token")
        }

        req.user = user;

        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid acess token");
    }
})