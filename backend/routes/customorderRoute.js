import express from "express";
import {
  createCustomOrder,
  listCustomOrders,
  deleteCustomOrder,
} from "../controllers/customorderController.js";

const router = express.Router();

/* CREATE - User submits a custom order */
router.post("/", createCustomOrder);

/* LIST - Admin fetches all custom orders */
router.get("/list", listCustomOrders);

/* DELETE - Admin deletes a custom order by ID */
router.post("/remove/:id", deleteCustomOrder);

export default router;