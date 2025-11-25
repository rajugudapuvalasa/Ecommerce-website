import express from "express";
const router = express.Router();
import {signup, login, googleAuth, getAllUsers} from "../controller/userController.js";

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/googleAuth').post(googleAuth);
router.route('/allusers').get(getAllUsers);
export default router;