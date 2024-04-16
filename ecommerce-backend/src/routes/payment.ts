import { Router } from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";

const router = Router();

router.route("/create").post( createPaymentIntent);
