import express from 'express';
import { addMessage, getAllMessages } from '../controllers/message.js';
const router = express.Router();

router.post('/', addMessage);

router.post('/getMsgs', getAllMessages);

export default router