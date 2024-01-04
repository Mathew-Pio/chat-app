import express from 'express';
import { allUsers, login, register, setAvatar } from '../controllers/user.js';

const router = express.Router();

router.post('/', register)

router.post('/login', login)

router.post('/setAvatar/:id', setAvatar);

router.get('/allUsers/:id', allUsers);

export default router 