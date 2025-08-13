import { Router } from "express";

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController";

const router = Router();
const base = "department";

router.get(`/${base}`, getDepartments);
router.get(`/${base}/:id`, getDepartmentById);
router.post(`/${base}`, createDepartment);
router.put(`/${base}/:id`, updateDepartment);
router.delete(`/${base}/:id`, deleteDepartment);

export default router;
