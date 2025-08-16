import { Router } from "express";
import * as multer from "multer";
import { uploadFile } from "../controllers/fileController";
import { checkS3Connection } from "../controllers/s3Controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/file", upload.single("file"), uploadFile);
router.get("/check", checkS3Connection);

export default router;