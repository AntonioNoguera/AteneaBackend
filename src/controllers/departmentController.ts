import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";

export const getDepartments: RequestHandler = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener departamentos" });
  }
};

export const getDepartmentById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res.status(404).json({ error: "Departamento no encontrado" });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener departamento" });
  }
};

export const createDepartment: RequestHandler = async (req, res) => {
  const { name, lastContributor, lastModification } = req.body;

  try {
    const department = await prisma.department.create({
      data: { name, lastContributor, lastModification },
    });

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: "Error al crear departamento" });
  }
};

export const updateDepartment: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, lastContributor, lastModification } = req.body;

  try {
    const department = await prisma.department.update({
      where: { id: Number(id) },
      data: { name, lastContributor, lastModification },
    });

    res.json(department);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar departamento" });
  }
};

export const deleteDepartment: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.department.delete({ where: { id: Number(id) } });
    res.json({ message: "Departamento eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar departamento" });
  }
};