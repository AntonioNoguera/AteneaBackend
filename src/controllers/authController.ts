// src/controllers/authController.ts
import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";
import { signAccessToken } from "../utils/JWT";
import { user_role } from "@prisma/client";

export const login: RequestHandler = async (req, res): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email y password requeridos" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ 
        error: "1-> Credenciales inválidas", 
        reason: process.env.NODE_ENV === "development" ? "El usuario no existe" : undefined 
      });
      return;
    }

    // Pendiente a usar el encryptado
    // const ok = await bcrypt.compare(password, user.password);

    const ok = password == user.password;

    if (!ok) {
      res.status(401).json({ 
        error: "2-> Credenciales inválidas", 
        reason: process.env.NODE_ENV === "development" ? "La contraseña no coincide" : undefined
      });
      return;
    }

    const token = signAccessToken(user.id);

    res.json({ 
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (e: any) {
    res.status(500).json({ 
      error: "3-> Error al iniciar sesión",
      reason: process.env.NODE_ENV === "development" ? e.message : undefined
    });
  }
};

export const signUp: RequestHandler = async (req, res) => { 

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