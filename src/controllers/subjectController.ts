// src/controllers/subjectController.ts
import { RequestHandler } from "express";
import prisma from "../prisma/prismaClient";
import { AuthRequest } from "../middleware/auth";

// helper: mapea "401" -> enum subject_plan.P401, etc.
function toPlanEnum(input?: string) {
    if (!input) return undefined;
    if (input === "401") return "P401";
    if (input === "402") return "P402";
    if (input === "4040") return "P4040";
    return undefined;
}

// Formatter para transformar el output de subject
function formatSubjectResponse(subject: any) {
    return {
        id: subject.id,
        name: subject.name,
        plan: subject.plan,
        subjectInfo: subject.subjectInfo,
        lastContributor: {
            id: subject.lastContributor.id,
            name: subject.lastContributor.name,
            email: subject.lastContributor.email,
            modifiedAt: subject.lastModification
        },
        resources: subject.resources
    };
}

// GET /api/subject/:id
export const getSubjectById: RequestHandler = async (req, res): Promise<void> => {
    
    const userId = (req as AuthRequest).userId;
    if (!userId || !Number.isInteger(userId)) { res.status(401).json({ error: "No autenticado" }); return; }

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) { res.status(400).json({ error: "ID inválido" }); return; }

    try {
        const row = await prisma.subject.findUnique({
            where: { id },
            include: {
                parentAcademy: { select: { id: true, name: true } },
                lastContributor: { select: { id: true, name: true, email: true } },
                resources: true
            }
        });
        if (!row) { res.status(404).json({ error: "Materia no encontrada" }); return; }
        
        res.json(formatSubjectResponse(row)); return;
    } catch {
        res.status(500).json({ error: "Error al obtener materia" }); return;
    }
};

// POST /api/subject
export const createSubject: RequestHandler = async (req, res): Promise<void> => {
    const { name, parentAcademyId, plan, subjectInfo } = req.body as {
        name?: string; parentAcademyId?: number; plan?: string; subjectInfo?: any;
    };

    const userId = (req as AuthRequest).userId;
    if (!userId || !Number.isInteger(userId)) { res.status(401).json({ error: "No autenticado" }); return; }

    const planEnum = toPlanEnum(plan);
    if (typeof name !== "string" || !name.trim().length || !Number.isInteger(Number(parentAcademyId)) || !planEnum) {
        res.status(400).json({ error: "name, parentAcademyId y plan (401|402|4040) son requeridos" }); return;
    }

    try {
        const created = await prisma.subject.create({
            data: {
                name: name.trim(),
                parentAcademy: { connect: { id: Number(parentAcademyId) } },
                plan: planEnum as any,
                subjectInfo: subjectInfo ?? null,
                lastContributor: { connect: { id: userId } },
            },
            include: {
                parentAcademy: { select: { id: true, name: true } },
                lastContributor: { select: { id: true, name: true, email: true } },
                resources: true
            }
        });
        
        res.status(201).json(formatSubjectResponse(created)); return;
    } catch (e: any) {
        if (e?.code === "P2003") { res.status(400).json({ error: "parentAcademyId o usuario inválido" }); return; }
        res.status(500).json({ error: "Error al crear materia" }); return;
    }
};

// PUT /api/subject/:id  (parcial)
export const updateSubject: RequestHandler = async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) { res.status(400).json({ error: "ID inválido" }); return; }

    const { name, parentAcademyId, plan, subjectInfo } = req.body as {
        name?: string; parentAcademyId?: number; plan?: string; subjectInfo?: any;
    };
    const userId = (req as AuthRequest).userId;

    if (!userId || !Number.isInteger(userId)) { res.status(401).json({ error: "No autenticado" }); return; }

    const data: any = {};
    if (typeof name === "string") data.name = name.trim();
    if (typeof parentAcademyId !== "undefined") {
        if (!Number.isInteger(Number(parentAcademyId))) { res.status(400).json({ error: "parentAcademyId inválido" }); return; }
        data.parentAcademy = { connect: { id: Number(parentAcademyId) } };
    }
    if (typeof plan !== "undefined") {
        const pe = toPlanEnum(plan);
        if (!pe) { res.status(400).json({ error: "plan inválido (401|402|4040)" }); return; }
        data.plan = pe;
    }
    if (typeof subjectInfo !== "undefined") data.subjectInfo = subjectInfo;
    if (userId && Number.isInteger(userId)) data.lastContributor = { connect: { id: userId } };

    try {
        const updated = await prisma.subject.update({
            where: { id },
            data,
            include: {
                parentAcademy: { select: { id: true, name: true } },
                lastContributor: { select: { id: true, name: true, email: true } },
                resources: true
            }
        });
        
        res.json(formatSubjectResponse(updated)); return;
    } catch (e: any) {
        if (e?.code === "P2025") { res.status(404).json({ error: "Materia no encontrada" }); return; }
        if (e?.code === "P2003") { res.status(400).json({ error: "parentAcademyId o usuario inválido" }); return; }
        res.status(500).json({ error: "Error al actualizar materia" }); return;
    }
};

// DELETE /api/subject/:id
export const deleteSubject: RequestHandler = async (req, res): Promise<void> => {
    
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) { res.status(400).json({ error: "ID inválido" }); return; }

    try {
        await prisma.subject.delete({ where: { id } });
        res.json({ message: "Materia eliminada" }); return;
    } catch (e: any) {
        if (e?.code === "P2025") { res.status(404).json({ error: "Materia no encontrada" }); return; }
        res.status(500).json({ error: "Error al eliminar materia" }); return;
    }
};