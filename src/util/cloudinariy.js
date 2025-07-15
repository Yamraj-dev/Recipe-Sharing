import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("Cloudinary Config Loaded:", {
            cloud_name: cloudinary.config().cloud_name,
            api_key: cloudinary.config().api_key,
            api_secret: cloudinary.config().api_secret ? "✅ loaded" : "❌ missing"
        });
        console.log("Uploading to Cloudinary from:", localFilePath);
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        // file has been uploaded successfull
        console.log("file uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath); // remove the locally saved file as the upload failed
        return null;
    }
};
