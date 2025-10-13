import { Router } from "express";
import { addFAQCategory, deleteFAQCategory, updateFAQCategory, viewFAQCategory } from "../controllers/faqCategory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/")
    .get(verifyJWT, viewFAQCategory)
    .post(verifyJWT, addFAQCategory)
    .patch(verifyJWT, updateFAQCategory)
    .delete(verifyJWT, deleteFAQCategory)

export default router