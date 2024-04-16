import { Router } from "express";
import { GetDashBoardStats, getBarCharts, getLineCharts, getPieCharts } from "../controllers/statsController.js";

const router = Router();

router.route("/stats").post(GetDashBoardStats)
router.route("/pieCharts").post(getPieCharts)
router.route("/barCharts").post(getBarCharts)
router.route("/lineCharts").post(getLineCharts)




export default router