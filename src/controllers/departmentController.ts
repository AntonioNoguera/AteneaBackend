// src/controllers/departmentController.ts
import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";

// GET /api/department
export const getDepartments: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const items = await prisma.department.findMany({
      include: { lastContributor: { select: { id: true, name: true, email: true } } },
      orderBy: { id: "asc" }
    });
    res.json(items);
    return;
  } catch {
    res.status(500).json({ error: "Error al obtener departamentos" });
    return;
  }
};

// GET /api/department/:id
export const getDepartmentById: RequestHandler = async (req, res): Promise<void> => {
  const idNum = Number(req.params.id);
  if (!Number.isInteger(idNum)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const item = await prisma.department.findUnique({
      where: { id: idNum },
      include: { lastContributor: { select: { id: true, name: true, email: true } } }
    });
    if (!item) {
      res.status(404).json({ error: "Departamento no encontrado" });
      return;
    }
    res.json(item);
    return;
  } catch {
    res.status(500).json({ error: "Error al obtener departamento" });
    return;
  }
};

// POST /api/department
export const createDepartment: RequestHandler = async (req, res): Promise<void> => {
  const { name, lastContributorId } = req.body as { name?: string; lastContributorId?: number };

  if (typeof name !== "string" || !name.trim().length || !Number.isInteger(Number(lastContributorId))) {
    res.status(400).json({ error: "name y lastContributorId son requeridos" });
    return;
  }

  try {
    const created = await prisma.department.create({
      data: { name: name.trim(), lastContributorId: Number(lastContributorId) },
      include: { lastContributor: { select: { id: true, name: true, email: true } } }
    });
    res.status(201).json(created);
    return;
  } catch (e: any) {
    if (e?.code === "P2003") { // FK inválida
      res.status(400).json({ error: "lastContributorId no existe en user" });
      return;
    }
    res.status(500).json({ error: "Error al crear departamento" });
    return;
  }
};

// PUT /api/department/:id
export const updateDepartment: RequestHandler = async (req, res): Promise<void> => {
  const idNum = Number(req.params.id);
  if (!Number.isInteger(idNum)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const { name, lastContributorId } = req.body as { name?: string; lastContributorId?: number };
  const data: Record<string, unknown> = {};

  if (typeof name === "string") data.name = name.trim();
  if (typeof lastContributorId !== "undefined") {
    if (!Number.isInteger(Number(lastContributorId))) {
      res.status(400).json({ error: "lastContributorId inválido" });
      return;
    }
    data.lastContributorId = Number(lastContributorId);
  }

  try {
    const updated = await prisma.department.update({
      where: { id: idNum },
      data,
      include: { lastContributor: { select: { id: true, name: true, email: true } } }
    });
    res.json(updated);
    return;
  } catch (e: any) {
    if (e?.code === "P2025") {
      res.status(404).json({ error: "Departamento no encontrado" });
      return;
    }
    if (e?.code === "P2003") {
      res.status(400).json({ error: "lastContributorId no existe en user" });
      return;
    }
    res.status(500).json({ error: "Error al actualizar departamento" });
    return;
  }
};

// DELETE /api/department/:id
export const deleteDepartment: RequestHandler = async (req, res): Promise<void> => {
  const idNum = Number(req.params.id);
  if (!Number.isInteger(idNum)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    await prisma.department.delete({ where: { id: idNum } });
    res.json({ message: "Departamento eliminado" });
    return;
  } catch (e: any) {
    if (e?.code === "P2025") {
      res.status(404).json({ error: "Departamento no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al eliminar departamento" });
    return;
  }
};
