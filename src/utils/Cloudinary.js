import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has been uploaded successfully
    console.log("File uploaded on cloudinary", response);
    console.log(response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // it will remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};


export {uploadOnCloudinary};
