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
