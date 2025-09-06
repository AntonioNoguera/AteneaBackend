// src/routes/userRoutes.ts

import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

let userRoute: string = "user";

router.get(`/${userRoute}`, getUsers);
router.get(`/${userRoute}/:id`, getUserById); 
router.put(`/${userRoute}/:id`, updateUser);
router.delete(`/${userRoute}/:id`, deleteUser);

export default router;
