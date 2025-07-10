import asyncHandler from "../util/asyncHandler.js";
import ApiError from "../util/ApiError.js";
import ApiResponse from "../util/ApiResponse.js";
import User from "../model/user.model.js";

const genrateAccessTokenAndgenrateRefreshTokens = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
}

export const Register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field required!");
    }

    const existingUser = User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(400, "User already exist please login");
    }

    console.log(req.file);
    const profileImg = req.file.img;

    if (!profileImg) {
        throw new ApiError(400, "Profile img is required!")
    }

    const newUser = await User.create({ username, email, password, img: profileImg.url });

    const createdUser = await User.findById(newUser._id).select("-password");

    if (!createdUser) {
        throw new ApiError(400, "something went worng while creating user!");
    }

    return res.status(200).json(new ApiResponse(200, "User register successfully!"))

});

export const Login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!(email || password)) {
        throw new ApiError(400, "all fields required!");
    }

    const user = await User.findOne(email);

    if (!user) {
        throw new ApiError(400, "user does not exist!")
    }

    const correctPassword = await user.isPasswordCorrect(password);

    if (!correctPassword) {
        throw new ApiError(400, "Invalid user credentials!")
    }

    const { accessToken, refreshToken } = user.genrateAccessTokenAndgenrateRefreshTokens(user._id);

    const logedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: logedInUser, accessToken, refreshToken }, "User logedin successfully"));

})

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
        .cookie("accessToken", options)
        .cookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));

});

