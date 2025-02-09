import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";

// Obtener todos los usuarios
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users); // ❌ No usar return aquí
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Crear un usuario
export const createUser: RequestHandler = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await prisma.user.create({
      data: { name, email, password, role },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// Actualizar un usuario
export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: { name, email, password, role },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Eliminar un usuario
export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: id } });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
