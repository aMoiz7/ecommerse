import { Router } from "express";
import { newOrder } from "../controllers/orderController.js";
const router = Router();
router.route("/new").post(newOrder);
export default router;
