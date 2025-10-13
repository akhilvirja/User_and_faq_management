import { Router } from 'express' 
import { changePassword, getUserDetails, updateUser, userLogin, userLogout, userSignup } from '../controllers/user.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/signup").post(userSignup)
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT, userLogout)
router.route("/").put(verifyJWT, updateUser).get(verifyJWT, getUserDetails)
router.route("/change-pass").post(verifyJWT, changePassword)

export default router