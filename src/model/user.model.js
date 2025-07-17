import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String, 
        required: true,
        public_id: String
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true})
 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    }, process.env.Access_Token, {expiresIn: process.env.Access_Token_Expiry})
};

userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.Refresh_Token, {expiresIn: process.env.Refresh_Token_Expiry})
}

const User = mongoose.model("User", userSchema);

export default User;