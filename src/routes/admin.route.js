import { Router } from 'express'
import { verifyAdmin, verifyJWT } from '../middlewares/auth.middleware.js'
import { addUser, showAllFaq, showAllUsers } from '../controllers/admin.controller.js'

const router = Router()

router.route("/add").post(verifyJWT,verifyAdmin, addUser)
router.route("/allusers").get(verifyJWT, verifyAdmin, showAllUsers)
router.route("/allfaqs").get(verifyJWT, verifyAdmin, showAllFaq)

export default router