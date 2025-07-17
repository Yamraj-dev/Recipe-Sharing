import asyncHandler from "../util/asyncHandler.js";
import ApiError from "../util/ApiError.js";
import ApiResponse from "../util/ApiResponse.js";
import User from "../model/user.model.js";
import uploadOnCloudinary from "../util/cloudinariy.js"
import jwt from "jsonwebtoken";
import deleteFromCloudinary from "../util/Delete_Old_Image.js";

const generateAccessTokenAndGenerateRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.genrateAccessToken();
        const refreshToken = user.genrateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong while genrating refresh and access token")
    }
}

export const Register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field required!");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(400, "User already exist please login");
    }

    console.log(req.file?.path);
    const profileLocalPath = req.file?.path;

    if (!profileLocalPath) {
        throw new ApiError(400, "Profile img is required!")
    }

    const profileImg = await uploadOnCloudinary(profileLocalPath);

    if (!profileImg) {
        throw new ApiError(405, "Something went wrong while uploading the image!");
    }

    console.log(profileImg);

    const newUser = await User.create({ username, email, password, img: profileImg.url, public_id: profileImg.public_id });

    const createdUser = await User.findById(newUser._id).select("-password");

    if (!createdUser) {
        throw new ApiError(400, "something went worng while creating user!");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User register successfully!"))

});

export const Login = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required!");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "User does not exist!");

    const correctPassword = await user.isPasswordCorrect(password);
    if (!correctPassword) {
        throw new ApiError(400, "Invalid user credentials!")
    };

    const { accessToken, refreshToken } = await generateAccessTokenAndGenerateRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

export const LogOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        }
    );
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));

});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.Refresh_Token);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, newRefreshToken },
                "Access token refreshed successfully"
            ))
    } catch (error) {
        console.error("Refresh token error:", error);
        throw new ApiError(401, "Invalid refresh token");
    }
});

export const GetCurrentUSer = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export const ChangePassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if(!oldPassword) {
        throw new ApiError(400, "Enter your old password!")
    };

    const user = await User.findById(req.user?._id);

    if(!user) {
        throw new ApiError(401, "unauthorized request");
    };

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))

});

export const UpdateImg = asyncHandler(async (req, res) => {
    const ImgLocalPath = req.file?.path;
    if (!ImgLocalPath) throw new ApiError(400, "Img file is missing");

    const img = await uploadOnCloudinary(ImgLocalPath);
    if (!img.url) throw new ApiError(400, "Error while uploading img");

    const user = await User.findById(req.user._id);

    if (user.img?.public_id) {
        await deleteFromCloudinary(user.img.public_id);
    }

    user.img = { url: img.url, public_id: img.public_id };
    await user.save();

    const safeUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, safeUser, "Img updated successfully"));
});