import express from "express"
import ticketController from "../controller/ticketController.js";
import protectedRoute from "../middlewares/protectedRoute.js";
import roleAuth from "../middlewares/roleAuthorization.js";


const router = express.Router()


//create tickets route 
router.post('/tickets', protectedRoute, roleAuth("user"), ticketController.createTickets);


//get all ticket route
router.get('/tickets', protectedRoute, roleAuth("admin", "agent"), ticketController.getAllTicket);


//get logged-in user's all tickets
router.get("/tickets/my", protectedRoute, roleAuth("user"), ticketController.getUserTickets) 


//get single ticket route
router.get('/tickets/:id', protectedRoute, roleAuth("user", "agent"), ticketController.getTicket);


//delete ticket route
router.delete('/tickets/:id', protectedRoute, roleAuth("user", "agent"), ticketController.deleteTicket);


//update ticket route
router.patch('/tickets/:id', protectedRoute,roleAuth("user", "agent"), ticketController.updateTicket);


export default router;