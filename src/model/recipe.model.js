import mongoose, { Schema } from "mongoose";

const recipeSchema = new mongoose.Schema({
    recipe_name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    recipe: {
        type: String,
        required: true
    },
    recipe_img: {
        type: String,
        required: true
    },
    tip: {
        type: String
    }

}, {timestamps: true})