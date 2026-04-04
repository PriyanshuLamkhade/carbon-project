import cloudinary from "cloudinary";
import getBuffer from "../config/datauri.js";

const uploadImagesToCloudinary = async (files: any[], folder = "uploads") => {
  const uploadPromises = files.map((file: any, index: number) => {
    const file64 = getBuffer(file);

    if (!file64.content) {
      throw new Error("File conversion failed");
    }

    return cloudinary.v2.uploader.upload(file64.content, {
      folder, //  dynamic folder
      public_id: `${folder}_${Date.now()}_${index}_${Math.round(Math.random()*1e9)}`
    });
  });

  const results = await Promise.all(uploadPromises);

  return results.map((item) => ({
    url: item.secure_url,
    public_id: item.public_id,
  }));
};

export default uploadImagesToCloudinary;

// product images
//await uploadImagesToCloudinary(req.files, "submission");

// user profile images
//await uploadImagesToCloudinary(req.files, "verified");