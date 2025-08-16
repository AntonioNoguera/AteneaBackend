// src/controllers/fileController.ts
import { RequestHandler } from "express";
import { s3 } from "../utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { HeadBucketCommand } from "@aws-sdk/client-s3";

export const uploadFile: RequestHandler = async (req, res): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ error: "No se envió ningún archivo (form-data: file)" });
      return;
    }

    const bucketName = process.env.AWS_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;

    // sanity check: el bucket existe y tienes permiso
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));

    const key = `uploads/${Date.now()}-${file.originalname}`;
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    res.json({
      message: "Archivo subido con éxito",
      url: `https://${bucketName}.s3.${region}.amazonaws.com/${key}`,
      key
    });
    return;

  } catch (err: any) {
    // Log útil para depurar (quítalo o limita en prod)
    console.error("[uploadFile] AWS error:", {
      name: err?.name,
      code: err?.$metadata?.httpStatusCode,
      message: err?.message,
      bucket: process.env.AWS_BUCKET_NAME,
      regionTried: process.env.AWS_REGION,
    });

    res.status(500).json({
      error: "Error al subir archivo",
      reason: process.env.NODE_ENV === "development" ? err?.message : undefined,
    });
    return;
  }
};

