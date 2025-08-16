// src/controllers/s3CheckController.ts
import { Request, Response } from "express";
import { s3 } from "../utils/s3";
import { HeadBucketCommand, GetBucketLocationCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;

export const checkS3Connection = async (_req: Request, res: Response): Promise<void> => {
  try {
    // 1) Pregunta la región real del bucket (requiere s3:GetBucketLocation)
    const loc = await s3.send(new GetBucketLocationCommand({ Bucket: BUCKET_NAME }));
    const bucketRegion = loc.LocationConstraint || "us-east-1"; // S3 devuelve null/'' para us-east-1

    // 2) HeadBucket para validar acceso
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));

    res.json({
      message: "✅ Conexión exitosa a S3",
      bucketChecked: BUCKET_NAME,
      bucketRegion,
      clientRegion: process.env.AWS_REGION,
    });
    return;
  } catch (err: any) {
    console.error("[checkS3Connection]", {
      name: err?.name,
      code: err?.$metadata?.httpStatusCode,
      message: err?.message,
      clientRegion: process.env.AWS_REGION,
      bucket: BUCKET_NAME,
    });
    res.status(500).json({
      error: "❌ Error verificando conexión con S3",
      details: err?.message ?? "UnknownError"
    });
    return;
  }
};
