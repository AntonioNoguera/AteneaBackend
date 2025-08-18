// src/routes/fileRoutes.ts
import { Router } from "express";
import * as multer from "multer";
import {
  uploadSubjectResource,
  getResourceSignedUrl,
  deleteResource
} from "../controllers/fileController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// subir archivo a una materia
router.post("/subject/:id/resource", upload.single("file"), uploadSubjectResource);

// obtener URL firmada para descargar/ver
router.get("/resource/:id/url", getResourceSignedUrl);

// eliminar recurso
router.delete("/resource/:id", deleteResource);

export default router;