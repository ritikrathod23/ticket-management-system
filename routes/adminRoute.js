import express from "express";
import adminController from "../controller/adminController.js";
import protectedRoute from "../middlewares/protectedRoute.js";
import roleAuth from "../middlewares/roleAuthorization.js";

const router = express.Router()


router.get('/users',  protectedRoute, roleAuth("admin"), adminController.getUsers )     


router.patch('/users/:id/role',protectedRoute, roleAuth("admin"), adminController.changeUserRole )     


router.patch('/users/:id/status', protectedRoute, roleAuth("admin"), adminController.toggleUserStatus )     




export default router;