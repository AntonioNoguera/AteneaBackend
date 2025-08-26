
import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";
import { s3 } from "../utils/s3";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as crypto from "crypto";

function uniqueKey(originalName: string) {
  const ts = Date.now().toString(36);
  const rnd = crypto.randomBytes(6).toString("hex");
  return `subjects/${ts}-${rnd}-${originalName.replace(/\s+/g, "_")}`;
}

const url_ttl_min = 5;

/**
 * POST /api/subject/:id/resource
 * form-data: file (File), name? (string), description? (string)
 */
export const uploadSubjectResource: RequestHandler = async (req, res): Promise<void> => {
  try {
    const subjectId = Number(req.params.forSubject);
    const file = req.file as Express.Multer.File | undefined;
    const bucket = process.env.AWS_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;

    if (!Number.isInteger(subjectId)) { res.status(400).json({ error: "subjectId inválido" }); return; }
    if (!file) { res.status(400).json({ error: "Archivo requerido (form-data: file)" }); return; }

    const allowed = ["application/pdf", "image/png", "image/jpeg", "text/plain"];
    if (!allowed.includes(file.mimetype)) { res.status(400).json({ error: "Tipo de archivo no permitido" }); return; }

    const key = uniqueKey(file.originalname);

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const created = await prisma.resource.create({
      data: {
        subjectId,
        name: (req.body?.name as string) || file.originalname,
        fileType: file.mimetype,
        description: (req.body?.description as string) || key, // Ahora guardamos el S3 key en description
        size: String(file.size)
      },
    });
 
    res.status(201).json({ message: "Recurso creado", resource: created });
    return;
  } catch (err) {
    console.error("[uploadSubjectResource]", err);
    res.status(500).json({ error: "Error al subir y guardar recurso" });
    return;
  }
};

/**
 * GET /api/resource/:id/url
 * Devuelve URL firmada temporal para descargar el archivo
 */
export const getResourceSignedUrl: RequestHandler = async (req, res): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) { res.status(400).json({ error: "ID inválido" }); return; }

    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) { res.status(404).json({ error: "Recurso no encontrado" }); return; }

    const bucket = process.env.AWS_BUCKET_NAME!;
    const key = resource.description;
    const expiresIn = 60 * url_ttl_min;

    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
        // Puedes sugerir un nombre de descarga:
        ResponseContentDisposition: `inline; filename="${resource.name}"`,
      }),
      { expiresIn }
    );

    res.json({ url, expiresInSeconds: expiresIn });
    return;
  } catch (err) {
    console.error("[getResourceSignedUrl]", err);
    res.status(500).json({ error: "Error al generar URL firmada" });
    return;
  }
};

/**
 * DELETE /api/resource/:id
 * Borra el objeto en S3 y el registro en DB
 */
export const deleteResource: RequestHandler = async (req, res): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) { res.status(400).json({ error: "ID inválido" }); return; }

    // Primero obtenemos el key para borrarlo en S3
    const item = await prisma.resource.findUnique({ where: { id } });
    if (!item) { res.status(404).json({ error: "Recurso no encontrado" }); return; }

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: item.description, // Ahora leemos el S3 key desde description
    }));

    await prisma.resource.delete({ where: { id } });

    res.json({ message: "Recurso eliminado" });
    return;
  } catch (err) {
    console.error("[deleteResource]", err);
    res.status(500).json({ error: "Error al eliminar recurso" });
    return;
  }
};