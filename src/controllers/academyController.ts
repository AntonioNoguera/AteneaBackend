// src/controllers/academyController.ts
import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";
import { AuthRequest } from "../middleware/auth";

// GET /api/academy
export const getAcademies: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const items = await prisma.academy.findMany({
      include: { 
        lastContributor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { id: "asc" },
    });
    res.json(items.map(shapeAcademy));
    return;
  } catch {
    res.status(500).json({ error: "Error al obtener academies" });
    return;
  }
};

// GET /api/academy/by-department/:departmentId
export const getAcademiesByDepartment: RequestHandler = async (req, res): Promise<void> => {
  const departmentIdNum = Number(req.params.departmentId);
  
  if (!Number.isInteger(departmentIdNum)) {
    res.status(400).json({ error: "Department ID inválido" });
    return;
  }

  try {
    const academies = await prisma.academy.findMany({
      where: { parentDepartmentId: departmentIdNum },
      include: {
        lastContributor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { id: "asc" },
    });

    res.json(academies.map(shapeAcademy));
    return;
  } catch {
    res.status(500).json({ error: "Error al obtener academias por departamento" });
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

  if (typeof userId !== "number" || !Number.isInteger(userId)) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  if (typeof name !== "string" || !name.trim().length || !Number.isInteger(Number(parentDepartmentId))) {
    res.status(400).json({ error: "name y parentDepartmentId son requeridos" });
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
        lastContributor: { select: { id: true, name: true, email: true } },
      },
    });
    res.status(201).json(shapeAcademy(created));
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
        lastContributor: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(shapeAcademy(updated));
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

// Tipos para el formateador
type AcademyRow = {
  id: number;
  name: string;
  parentDepartmentId: number;
  lastModification: Date;
  lastContributorId: number; 
  lastContributor: { id: number; name: string; email: string };
};

// Formateador para Academy
export function shapeAcademy(row: AcademyRow) {
  const { lastModification, parentDepartmentId, lastContributorId, ...rest } = row;
  return {
    id: rest.id,
    name: rest.name, 
    lastContributor: {
      id: rest.lastContributor.id,
      name: rest.lastContributor.name,
      email: rest.lastContributor.email,
      modifiedAt: lastModification,
    },
  };
} 

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
        lastContributor: { select: { id: true, name: true, email: true } },
        subjects: {
          select: {
            id: true,
            name: true,
            plan: true, 
            lastModification: true, 
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!item) {
      res.status(404).json({ error: "Academy no encontrada" });
      return;
    }

    res.json(shapeAcademyWithSubjects(item));
    return;
  } catch {
    res.status(500).json({ error: "Error al obtener academy" });
    return;
  }
};

// Tipo para Academy con subjects
type AcademyWithSubjects = AcademyRow & {
  subjects: Array<{
    id: number;
    name: string;
    plan: string; 
    lastModification: Date; 
  }>;
};

// Formateador para Academy con subjects
export function shapeAcademyWithSubjects(row: AcademyWithSubjects) {
  const { lastModification, parentDepartmentId, lastContributorId, subjects, ...rest } = row;
  
  return {
    id: rest.id,
    name: rest.name,
    lastContributor: {
      id: rest.lastContributor.id,
      name: rest.lastContributor.name,
      email: rest.lastContributor.email,
      modifiedAt: lastModification,
    },
    subjects: subjects.map(subject => ({
      id: subject.id,
      name: subject.name,
      plan: subject.plan,
      lastModification: subject.lastModification, 
    })),
  };
}