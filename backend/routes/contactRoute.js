// routes/contactRoute.js
import express from 'express';
import { 
  submitContactForm, 
  getAllContactMessages, 
  deleteContactMessage 
} from '../controllers/contactController.js';
import adminAuth from '../middleware/adminAuth.js'; // Import your admin auth middleware

const contactRouter = express.Router();

// Public route - Submit contact form
contactRouter.post('/submit', submitContactForm);

// Admin routes - Get and manage messages
contactRouter.get('/admin/messages', adminAuth, getAllContactMessages);
contactRouter.delete('/admin/messages/:id', adminAuth, deleteContactMessage);

export default contactRouter;