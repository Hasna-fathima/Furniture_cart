import { Router } from "express";
import { requireSignin, authenticateUser } from "../Middleware/auth";
import { addOrder, getOrders, getOrder } from "../Controllers/orderController";

const router = Router();

router.post("/addOrder", requireSignin, authenticateUser, addOrder);
router.get("/getOrders", requireSignin, authenticateUser, getOrders);
router.post("/getOrder", requireSignin, authenticateUser, getOrder);

export default router;