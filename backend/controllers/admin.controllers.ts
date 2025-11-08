import { type Request, type Response } from "express";
import { studentSchema } from "../utility/zod";
import prisma from "../utility/prisma";

export const addStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentData = studentSchema.parse(req.body);

    const {
      firstName,
      lastName,
      fatherName,
      motherName,
      dateOfBirth,
      gender,
      class: studentClass,
      section,
      rollNumber,
      bloodGroup,
      address,
      phoneNumber,
      relegion,
      city,
      state,
      zipCode,
      country,
      photo,
      email,
      status,
    } = studentData;
    if (!req.user || req.user.roles !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }
    if (
      !firstName ||
      !lastName ||
      !fatherName ||
      !motherName ||
      !dateOfBirth ||
      !gender ||
      !studentClass ||
      !section ||
      !address ||
      !phoneNumber ||
      !relegion ||
      !city ||
      !state ||
      !zipCode ||
      !country
    ) {
      res
        .status(400)
        .json({ message: "All required fields must be provided." });
      // return;
    }
    if (phoneNumber.length < 10) {
      res
        .status(400)
        .json({ message: "Phone number must be at least 10 digits." });
      // return;
    }
    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        fatherName,
        motherName,
        dateOfBirth,
        gender,
        class: studentClass,
        section,
        rollNumber,
        bloodGroup,
        address,
        phoneNumber,
        relegion,
        city,
        state,
        zipCode,
        country,
        photo,
        email,
        status,
      },
    });

    res.status(201).json({
      message: "Student added successfully",
      student: newStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error ",
    });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idParam = req.params.id;
    if (!idParam) {
      res.status(400).json({ message: "Student id is required in params." });
      return;
    }
    const id = idParam;

    if (!req.user || req.user.roles !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    const updateData = studentSchema.partial().parse(req.body);

    if (updateData.phoneNumber && updateData.phoneNumber.length < 10) {
      res
        .status(400)
        .json({ message: "Phone number must be at least 10 digits." });
      return;
    }

    const { class: studentClass, ...rest } = updateData as any;

    const dataToUpdate: any = { ...rest };
    if (studentClass !== undefined) dataToUpdate.class = studentClass;

    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ message: "No valid fields provided to update." });
      return;
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: dataToUpdate,
    });

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error: any) {
    // handle not found error from Prisma
    if (error?.code === "P2025") {
      res.status(404).json({ message: "Student not found." });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addTecaher=async()