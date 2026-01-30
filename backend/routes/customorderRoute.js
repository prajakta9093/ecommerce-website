import express from "express";
import CustomOrder from "../models/customorderModels.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await CustomOrder.create(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
