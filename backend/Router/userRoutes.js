import express from "express";
import {signup, login, googleAuth, getAllUsers, updateUserRole, deleteUser, getSingleUser} from "../controller/userController.js";
import { protect, checkRole ,isAdmin} from "../middleware/auth.js";
const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/googleAuth').post(googleAuth);
router.get("/check-role", protect, checkRole);
router.route('/').get(protect , isAdmin ,getAllUsers);
router.route('/:id').get(getSingleUser).put(updateUserRole).delete(deleteUser);

export default router;



