import Banner from "../models/bannerModel.js";
import cloudinary from "../config/cloudinary.js"; // adjust path to your cloudinary helper
import fs from "fs/promises";
import mongoose from "mongoose";

/**
 * Helper to upload local files (from multer) to Cloudinary and return array of secure_urls
 */
async function uploadFilesToCloudinary(files) {
  const urls = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Shopmall/Banner_images",
    });
    // push the secure url string (not an object)
    urls.push(result.secure_url);

    // remove local temp file
    try {
      await fs.unlink(file.path);
    } catch (err) {
      // ignore unlink errors, log optionally
      console.warn("Failed to remove temp file:", file.path, err.message);
    }
  }

  return urls;
}

/**
 * Create Banner
 * Expects multipart/form-data with:
 *  - title (string)
 *  - images (files)  (one or multiple)
 */
export const createBanner = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    // Upload images -> get array of URLs (strings)
    const imageUrls = await uploadFilesToCloudinary(req.files);

    const banner = await Banner.create({ title: title.trim(), images: imageUrls });
    return res.status(201).json({ success: true, banner });
  } catch (err) {
    console.error("createBanner error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * Get All Banners
 */
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    return res.json({ success: true, banners });
  } catch (err) {
    console.error("getBanners error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * Update Banner
 * Supports:
 *  - JSON body: { title, images }  --> replace title and images array (images = array of urls)
 *  - multipart/form-data with files in req.files --> will upload files and append to images (or you can replace)
 *
 * Note: caller can send `replaceImages=true` in query to replace images instead of appending.
 */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid banner id" });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    const { title } = req.body;
    let imagesFromBody = [];

    // if client sends images as JSON array in body (when not uploading files)
    if (req.body.images) {
      try {
        imagesFromBody = Array.isArray(req.body.images) ? req.body.images : JSON.parse(req.body.images);
      } catch (err) {
        // If parsing fails, ignore and continue
        imagesFromBody = [];
      }
    }

    // If files uploaded, upload them to cloudinary and get URLs
    let uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      uploadedUrls = await uploadFilesToCloudinary(req.files);
    }

    // decide whether to replace or append existing images
    const replaceImages = req.query.replaceImages === "true";

    let newImages;
    if (replaceImages) {
      // prefer body images first, then uploaded files
      newImages = [...imagesFromBody, ...uploadedUrls];
    } else {
      // append to existing images: banner.images + body images + uploaded files
      newImages = [...(banner.images || []), ...imagesFromBody, ...uploadedUrls];
    }

    // update fields
    banner.title = typeof title === "string" && title.trim() !== "" ? title.trim() : banner.title;
    banner.images = newImages;

    const updated = await banner.save();
    return res.json({ success: true, banner: updated });
  } catch (err) {
    console.error("updateBanner error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * Delete Banner
 */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid banner id" });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    await Banner.findByIdAndDelete(id);
    // NOTE: We are not removing images from Cloudinary because we don't store public_id.
    // If you want to delete from Cloudinary, store `public_id` when uploading and call cloudinary.uploader.destroy(public_id).

    return res.json({ success: true, message: "Banner Deleted" });
  } catch (err) {
    console.error("deleteBanner error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * Set Active Banner
 * Will mark all banners isActive = false then set chosen banner to true
 */
export const setActiveBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid banner id" });
    }

    // ensure banner exists
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    await Banner.updateMany({}, { isActive: false });
    const updated = await Banner.findByIdAndUpdate(id, { isActive: true }, { new: true });

    return res.json({ success: true, banner: updated });
  } catch (err) {
    console.error("setActiveBanner error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
