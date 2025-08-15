//userController.ts

import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";
import { user_role } from "@prisma/client";

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const createUser: RequestHandler = async (req, res) => { 

  const { name, email, password, role } = req.body as {
     name: string; email: string; password: string; role?: keyof typeof user_role;
   };

  try {
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password, 
        role: (role ?? "USER") as user_role 
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error("[createUser]", error);

    res.status(500).json({
      error: "Error al crear usuario",
      code: error?.code,
      message: error?.message
    });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id:  Number(id) },
      data: { name, email, password, role },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

