import { Router } from "express";
import { newUser, allUser, getuser, deleteuser } from "../controllers/userController.js";
import { isAdmin } from "../middlewares/isadmin.js";
const router = Router();
router.route("/login").post(newUser);
router.route("/alluser").post(isAdmin, allUser);
router.route("/:userid").get(isAdmin, getuser).delete(isAdmin, deleteuser);
export default router;
