import express from "express";
import { createBanner, deleteBanner, getBanners, setActiveBanner, updateBanner } from "../controller/bannerController.js";

const router = express.Router();

router.route("/").post(createBanner).get(getBanners)
router.route("/:id").put(updateBanner).delete(deleteBanner)
router.route("/active/:id").put(setActiveBanner)


export default router;
