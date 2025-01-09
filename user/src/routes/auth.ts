import express from 'express';
import { login, signup } from '../controllers/authcontroller';


const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

export default router;
