import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Env } from "./env.config";
import multer from "multer";
import path from "path";
import fs from "fs";

// Check if Cloudinary is configured with real keys
const isCloudinaryConfigured = 
  Env.CLOUDINARY_CLOUD_NAME && 
  Env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name" &&
  Env.CLOUDINARY_API_KEY &&
  Env.CLOUDINARY_API_KEY !== "your_cloudinary_api_key";

let storage: multer.StorageEngine;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: Env.CLOUDINARY_CLOUD_NAME,
    api_key: Env.CLOUDINARY_API_KEY,
    api_secret: Env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "profile-pictures",
      resource_type: "image",
      quality: "auto:good",
      format: "webp",
    } as object,
  });
} else {
  // Fallback to local disk storage if Cloudinary is not configured
  const uploadDir = path.join(process.cwd(), "public/uploads/profiles");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB limit
  fileFilter: (_, file, cb) => {
    const isValid = /^image\/(jpe?g|png|gif|webp)$/.test(file.mimetype);
    if (!isValid) {
      return cb(new Error("Only image files (JPG, PNG, GIF, WebP) are allowed"));
    }
    cb(null, true);
  },
});
