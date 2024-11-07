import express from "express";
import { loginUser } from 'controllers';

const router = express.Router();

router.post('/login', loginUser);