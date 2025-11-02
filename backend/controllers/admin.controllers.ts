import { type Request, type Response } from "express";
export const addStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      fatherName,
      motherName,
      dateOfBirth,
      gender,
      class,
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
    } = req.body;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
