import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const bookCategorySchema = z.object({
    name: z.string().min(1),
});

const bookSchema = z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    categoryId: z.number(),
    quantity: z.number().min(1),
    price: z.number().optional(),
    rackNo: z.string().optional(),
});

const bookIssueSchema = z.object({
    bookId: z.number(),
    studentId: z.number().optional(),
    staffId: z.number().optional(),
    dueDate: z.string().or(z.date()),
});

// Book Category
export const createBookCategory = async (req: Request, res: Response) => {
    try {
        const data = bookCategorySchema.parse(req.body);
        const category = await prisma.bookCategory.create({ data });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: "Error creating book category", error });
    }
};

export const getBookCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.bookCategory.findMany({
            include: { _count: { select: { books: true } } },
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

// Books
export const createBook = async (req: Request, res: Response) => {
    try {
        const data = bookSchema.parse(req.body);
        const book = await prisma.book.create({
            data: {
                ...data,
                available: data.quantity, // Initially available = quantity
            },
        });
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: "Error creating book", error });
    }
};

export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await prisma.book.findMany({
            include: { category: true },
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = bookSchema.partial().parse(req.body);
        const book = await prisma.book.update({
            where: { id: Number(id) },
            data,
        });
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: "Error updating book", error });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.book.delete({ where: { id: Number(id) } });
        res.json({ message: "Book deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book", error });
    }
};

// Book Issue
export const issueBook = async (req: Request, res: Response) => {
    try {
        const data = bookIssueSchema.parse(req.body);

        if (!data.studentId && !data.staffId) {
            return res.status(400).json({ message: "Either studentId or staffId is required" });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Check availability
            const book = await tx.book.findUnique({ where: { id: data.bookId } });
            if (!book || book.available < 1) {
                throw new Error("Book not available");
            }

            // Create issue
            const issue = await tx.bookIssue.create({
                data: {
                    bookId: data.bookId,
                    studentId: data.studentId,
                    staffId: data.staffId,
                    dueDate: new Date(data.dueDate),
                    status: "ISSUED",
                },
            });

            // Decrement available count
            await tx.book.update({
                where: { id: data.bookId },
                data: { available: { decrement: 1 } },
            });

            return issue;
        });

        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Error issuing book", error });
    }
};

export const returnBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Issue ID

        const result = await prisma.$transaction(async (tx) => {
            const issue = await tx.bookIssue.findUnique({ where: { id: Number(id) } });
            if (!issue || issue.status === "AVAILABLE") { // Status enum: AVAILABLE is not for Issue, it's BookStatus?
                // Wait, BookStatus enum has AVAILABLE? Yes.
                // But Issue status is BookStatus enum? Yes.
                // If returned, status should be... wait.
                // BookStatus: AVAILABLE, ISSUED, LOST, DAMAGED.
                // When returned, we might delete the issue record or mark it as returned?
                // Schema says `returnDate DateTime?`.
                // And `status BookStatus`.
                // Usually "RETURNED" is a status. But enum has AVAILABLE.
                // Maybe we mark it as AVAILABLE? Or we need a RETURNED status?
                // Let's use AVAILABLE to mean returned/closed.
                throw new Error("Issue not found or already returned");
            }

            const updatedIssue = await tx.bookIssue.update({
                where: { id: Number(id) },
                data: {
                    returnDate: new Date(),
                    status: "AVAILABLE", // Mark as returned/available
                },
            });

            // Increment available count
            await tx.book.update({
                where: { id: issue.bookId },
                data: { available: { increment: 1 } },
            });

            return updatedIssue;
        });

        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Error returning book", error });
    }
};

export const getIssuedBooks = async (req: Request, res: Response) => {
    try {
        const issues = await prisma.bookIssue.findMany({
            where: { status: "ISSUED" },
            include: {
                book: true,
                student: { select: { firstName: true, lastName: true, admissionNo: true } },
                staff: { select: { firstName: true, lastName: true } },
            },
        });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: "Error fetching issued books", error });
    }
};
