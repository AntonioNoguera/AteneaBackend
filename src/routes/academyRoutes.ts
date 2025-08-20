// src/routes/academyRoutes.ts
import { Router } from "express";

import {
  getAcademies,
  getAcademiesByDepartment,
  createAcademy,
  updateAcademy,
  deleteAcademy,
} from "../controllers/academyController";

const router = Router();
const base = "academy";

router.get(`/${base}`, getAcademies);
router.get(`/${base}/:departmentId`, getAcademiesByDepartment);
router.post(`/${base}`, createAcademy);
router.put(`/${base}/:id`, updateAcademy);
router.delete(`/${base}/:id`, deleteAcademy);

export default router;