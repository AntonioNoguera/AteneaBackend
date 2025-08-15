// src/controllers/academyController.ts
import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";
import { AuthRequest } from "../middleware/auth";

// GET /api/academy
export const getAcademies: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const items = await prisma.academy.findMany({
      include: {
        parentDepartment: { select: { id: true, name: true } },
        lastContributor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { id: "asc" },
    });
    res.json(items);
    return;
  } catch {
    res.status(500).json({ error: "Error al obtener academies" });
    return;
  }
};

// GET /api/academy/:id
export const getAcademyById: RequestHandler = async (req, res): Promise<void> => {
  const idNum = Number(req.params.id);
  if (!Number.isInteger(idNum)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const item = await prisma.academy.findUnique({
      where: { id: idNum },
      include: {
        parentDepartment: { select: { id: true, name: true } },
        lastContributor: { select: { id: true, name: true, email: true } },
      },
    });
    if (!item) {
      res.status(404).json({ error: "Academy no encontrada" });
      return;
    }
    res.json(item);
    return;
  } catch {
    res.status(500).json({ error: "Error al obtener academy" });
    return;
  }
};

// POST /api/academy 
export const createAcademy: RequestHandler = async (req, res): Promise<void> => {
  const { name, parentDepartmentId } = req.body as {
    name?: string;
    parentDepartmentId?: number;
  };

  const userId = (req as AuthRequest).userId;

  if (typeof name !== "string" || !name.trim().length || !Number.isInteger(Number(parentDepartmentId))) {
    res.status(400).json({ error: "name y parentDepartmentId son requeridos" });
    return;
  }

  if (typeof userId !== "number" || !Number.isInteger(userId)) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const created = await prisma.academy.create({
      data: {
        name: name.trim(),
        parentDepartment: { connect: { id: Number(parentDepartmentId) } },
        lastContributor: { connect: { id: userId } },
      },
      include: {
        parentDepartment: { select: { id: true, name: true } },
        lastContributor: { select: { id: true, name: true, email: true } },
      },
    });
    res.status(201).json(created);
    return;
  } catch (e: any) {
    if (e?.code === "P2003") {
      res.status(400).json({ error: "parentDepartmentId o usuario autenticado inválido" });
      return;
    }
    res.status(500).json({ error: e?.message });
    return;
  }
};

// PUT /api/academy/:id 
export const updateAcademy: RequestHandler = async (req, res): Promise<void> => {
  const idNum = Number(req.params.id);
  if (!Number.isInteger(idNum)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const { name, parentDepartmentId } = req.body as {
    name?: string;
    parentDepartmentId?: number;
  };
  const userId = (req as AuthRequest).userId;

  const data: any = {};
  if (typeof name === "string") data.name = name.trim();
  
  if (typeof userId === "number" && Number.isInteger(userId)) {
    data.lastContributor = { connect: { id: userId } };
  }

  try {
    const updated = await prisma.academy.update({
      where: { id: idNum },
      data,
      include: {
        parentDepartment: { select: { id: true, name: true } },
        lastContributor: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(updated);
    return;
  } catch (e: any) {
    if (e?.code === "P2025") {
      res.status(404).json({ error: "Academy no encontrada" });
      return;
    }
    if (e?.code === "P2003") {
      res.status(400).json({ error: "parentDepartmentId o usuario autenticado inválido" });
      return;
    }
    res.status(500).json({ error: "Error al actualizar academy" });
    return;
  }
};

// DELETE /api/academy/:id
export const deleteAcademy: RequestHandler = async (req, res): Promise<void> => {
  const idNum = Number(req.params.id);
  if (!Number.isInteger(idNum)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    await prisma.academy.delete({ where: { id: idNum } });
    res.json({ message: "Academy eliminada" });
    return;
  } catch (e: any) {
    if (e?.code === "P2025") {
      res.status(404).json({ error: "Academy no encontrada" });
      return;
    }
    res.status(500).json({ error: "Error al eliminar academy" });
    return;
  }
};
