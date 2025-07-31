import express from "express"
import authController from "../controller/authController.js";


const router = express.Router()


//register or signup route 
router.post('/register', authController.register);


//login route
router.post('/login', authController.login);

// //logout route
// router.post('/logout', userLogout);


export default router;