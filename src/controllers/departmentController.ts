// src/controllers/departmentController.ts
import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";
import { AuthRequest } from "../middleware/auth";

// GET /api/department
export const getDepartments: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const rows = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        lastModification: true,
        lastContributor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { id: "asc" },
    });

    res.json(rows.map(shapeDepartment));
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
      select: {
        id: true,
        name: true,
        lastModification: true,
        lastContributor: { select: { id: true, name: true, email: true } },
      },
    });

    if (!item) {
      res.status(404).json({ error: "Departamento no encontrado" });
      return;
    }

    res.json(shapeDepartment(item));
    return;
  } catch {
    res.status(500).json({ error: "Error al obtener departamento" });
    return;
  }
};

// POST /api/department 
export const createDepartment: RequestHandler = async (req, res): Promise<void> => {
  const { name } = req.body as { name?: string };
  const userId = (req as AuthRequest).userId;

  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "name requerido" });
    return;
  }

  if (!userId) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const created = await prisma.department.create({
      data: {
        name: name.trim(),
        lastContributor: { connect: { id: userId } },
      },
      select: {
        id: true,
        name: true,
        lastModification: true,
        lastContributor: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(shapeDepartment(created));
    return;
  } catch (e: any) {
    if (e?.code === "P2003") {
      res.status(400).json({ error: "lastContributor inválido" });
      return;
    }
    res.status(500).json({ error: "Error al crear departamento" });
    return;
  }
};
 
// PUT /api/department/:id
export const updateDepartment: RequestHandler = async (req, res): Promise<void> => {
  const idNum = Number(req.params.id);
  const { name } = req.body as { name?: string };

  if (!Number.isInteger(idNum)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }
  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "name requerido" });
    return;
  }

  // si quieres registrar quién modificó:
  const userId = (req as AuthRequest).userId;

  try {
    const updated = await prisma.department.update({
      where: { id: idNum },
      data: {
        name: name.trim(),
        ...(userId ? { lastContributor: { connect: { id: userId } } } : {}),
      },
      // respuesta con el mismo formato que GET (sin lastContributorId)
      select: {
        id: true,
        name: true,
        lastModification: true, // se actualizará automáticamente por @updatedAt
        lastContributor: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(shapeDepartment(updated));
    return;
  } catch (e: any) {
    if (e?.code === "P2025") {
      res.status(404).json({ error: "Departamento no encontrado" });
      return;
    }
    if (e?.code === "P2003") {
      res.status(400).json({ error: "lastContributorId inválido" });
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

//Formatters
type DeptRow = {
  id: number;
  name: string;
  lastModification: Date;
  lastContributor: { id: number; name: string; email: string };
};

function shapeDepartment(row: DeptRow) {
  const { lastModification, ...rest } = row;
  return {
    ...rest,
    lastContributor: {
      ...row.lastContributor,
      modifiedAt: lastModification,
    },
  };
}