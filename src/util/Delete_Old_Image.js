import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log("Old image deleted from Cloudinary");
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};
export default deleteFromCloudinary;
