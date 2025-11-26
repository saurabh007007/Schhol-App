import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const classSchema = z.object({
  name: z.string().min(1),
  numeric: z.number().optional(),
  classTeacherId: z.number().optional(),
});

const sectionSchema = z.object({
  name: z.string().min(1),
  classId: z.number(),
  capacity: z.number().optional(),
});

const subjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  type: z.string().optional(),
});

const subjectAllocationSchema = z.object({
  classId: z.number(),
  subjectId: z.number(),
  teacherId: z.number().optional(),
});

// Class Management
export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        classTeacher: true,
        sections: true,
        _count: { select: { students: true } },
      },
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const data = classSchema.parse(req.body);
    const { name, numeric, classTeacherId } = data;
    if (!name || !numeric || !classTeacherId) {
      res.status(400).json({
        message: "All feilds are required",
      });
      return;
    }
    const newClass = await prisma.class.create({
      data: {
        name,
        numeric,
        classTeacherId,
      },
    });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: "Error creating class", error });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = classSchema.partial().parse(req.body);
    const updatedClass = await prisma.class.update({
      where: { id: Number(id) },
      data,
    });
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: "Error updating class", error });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.class.delete({ where: { id: Number(id) } });
    res.json({ message: "Class deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting class", error });
  }
};

// Section Management
export const getSections = async (req: Request, res: Response) => {
  try {
    const sections = await prisma.section.findMany({
      include: { class: true, _count: { select: { students: true } } },
    });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sections", error });
  }
};

export const createSection = async (req: Request, res: Response) => {
  try {
    const data = sectionSchema.parse(req.body);
    const newSection = await prisma.section.create({ data });
    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: "Error creating section", error });
  }
};

export const updateSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = sectionSchema.partial().parse(req.body);
    const updatedSection = await prisma.section.update({
      where: { id: Number(id) },
      data,
    });
    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ message: "Error updating section", error });
  }
};

export const deleteSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.section.delete({ where: { id: Number(id) } });
    res.json({ message: "Section deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting section", error });
  }
};

// Subject Management
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  try {
    const data = subjectSchema.parse(req.body);
    const newSubject = await prisma.subject.create({ data });
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: "Error creating subject", error });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = subjectSchema.partial().parse(req.body);
    const updatedSubject = await prisma.subject.update({
      where: { id: Number(id) },
      data,
    });
    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: "Error updating subject", error });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.subject.delete({ where: { id: Number(id) } });
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subject", error });
  }
};

// Subject Allocation
export const getSubjectAllocations = async (req: Request, res: Response) => {
  try {
    const allocations = await prisma.subjectAllocation.findMany({
      include: { class: true, subject: true, teacher: true },
    });
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching allocations", error });
  }
};

export const createSubjectAllocation = async (req: Request, res: Response) => {
  try {
    const data = subjectAllocationSchema.parse(req.body);
    const allocation = await prisma.subjectAllocation.create({ data });
    res.status(201).json(allocation);
  } catch (error) {
    res.status(400).json({ message: "Error creating allocation", error });
  }
};

export const deleteSubjectAllocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.subjectAllocation.delete({ where: { id: Number(id) } });
    res.json({ message: "Allocation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting allocation", error });
  }
};
