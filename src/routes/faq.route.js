import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addFaq, deleteFaq, faqById, faqByUser, updateFaq } from "../controllers/faq.controller.js";

const router = Router()

router.route("/")
    .post(verifyJWT, addFaq)
    .put(verifyJWT, updateFaq)
    .delete(verifyJWT, deleteFaq)
router.route("/myfaq").get(verifyJWT, faqByUser)
router.route("/:id").get(verifyJWT, faqById)

export default router