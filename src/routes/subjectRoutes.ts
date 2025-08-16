import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from "../controllers/subjectController";

const router = Router();
const base = "subject";

router.get(`/${base}`, authMiddleware, getSubjects);
router.get(`/${base}/:id`, authMiddleware, getSubjectById);
router.post(`/${base}`, authMiddleware, createSubject);
router.put(`/${base}/:id`, authMiddleware, updateSubject);
router.delete(`/${base}/:id`, authMiddleware, deleteSubject);

export default router;