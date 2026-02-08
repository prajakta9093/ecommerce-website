import express from "express";
import { addReview, getReviewsByProduct } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// POST /api/reviews/add
reviewRouter.post("/add", addReview);

// GET /api/reviews/:productId
reviewRouter.get("/:productId", getReviewsByProduct);

export default reviewRouter;