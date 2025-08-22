// src/routes/academyRoutes.ts
import { Router } from "express";

import {
  getAcademies, 
  createAcademy,
  updateAcademy,
  deleteAcademy,
  getAcademyById
} from "../controllers/academyController";

const router = Router();
const base = "academy";

router.get(`/${base}`, getAcademies); 
router.get(`/${base}/:id`, getAcademyById);
router.post(`/${base}`, createAcademy);
router.put(`/${base}/:id`, updateAcademy);
router.delete(`/${base}/:id`, deleteAcademy);

export default router;