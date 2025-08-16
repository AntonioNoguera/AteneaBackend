//UserRoutes.ts

import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

let userRoute: string = "user";

router.get(`/${userRoute}`, getUsers);
router.post(`/${userRoute}`, createUser);
router.get(`/${userRoute}/:id`, getUserById); 
router.put(`/${userRoute}/:id`, updateUser);
router.delete(`/${userRoute}/:id`, deleteUser);

export default router;
