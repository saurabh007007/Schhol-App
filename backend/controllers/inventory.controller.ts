import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const categorySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

const itemSchema = z.object({
    name: z.string().min(1),
    categoryId: z.number(),
    unit: z.string().min(1),
    description: z.string().optional(),
});

const stockSchema = z.object({
    itemId: z.number(),
    quantity: z.number().min(1),
    purchasePrice: z.number(),
    supplier: z.string().optional(),
    purchaseDate: z.string().or(z.date()),
});

const issueSchema = z.object({
    itemId: z.number(),
    issuedTo: z.string().min(1), // Name of staff/dept
    issuedBy: z.number(), // User ID
    quantity: z.number().min(1),
    note: z.string().optional(),
});

// Categories
export const createCategory = async (req: Request, res: Response) => {
    try {
        const data = categorySchema.parse(req.body);
        const category = await prisma.inventoryCategory.create({ data });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: "Error creating category", error });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.inventoryCategory.findMany({
            include: { _count: { select: { items: true } } },
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

// Items
export const createItem = async (req: Request, res: Response) => {
    try {
        const data = itemSchema.parse(req.body);
        const item = await prisma.inventoryItem.create({ data });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: "Error creating item", error });
    }
};

export const getItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.inventoryItem.findMany({
            include: { category: true, stocks: true },
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = itemSchema.partial().parse(req.body);
        const item = await prisma.inventoryItem.update({
            where: { id: Number(id) },
            data,
        });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: "Error updating item", error });
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.inventoryItem.delete({ where: { id: Number(id) } });
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
};

// Stock
export const addStock = async (req: Request, res: Response) => {
    try {
        const data = stockSchema.parse(req.body);
        const stock = await prisma.inventoryStock.create({
            data: {
                itemId: data.itemId,
                quantity: data.quantity,
                purchasePrice: data.purchasePrice,
                supplier: data.supplier,
                purchaseDate: new Date(data.purchaseDate),
            },
        });
        res.status(201).json(stock);
    } catch (error) {
        res.status(400).json({ message: "Error adding stock", error });
    }
};

// Issue
export const issueItem = async (req: Request, res: Response) => {
    try {
        const data = issueSchema.parse(req.body);

        // Check stock availability (simple check: total stock - total issued)
        const totalStock = await prisma.inventoryStock.aggregate({
            where: { itemId: data.itemId },
            _sum: { quantity: true },
        });
        const totalIssued = await prisma.inventoryIssue.aggregate({
            where: { itemId: data.itemId, returnDate: null },
            _sum: { quantity: true },
        });

        const available = (totalStock._sum.quantity || 0) - (totalIssued._sum.quantity || 0);

        if (available < data.quantity) {
            return res.status(400).json({ message: `Insufficient stock. Available: ${available}` });
        }

        const issue = await prisma.inventoryIssue.create({
            data: {
                itemId: data.itemId,
                issuedTo: data.issuedTo,
                issuedBy: data.issuedBy,
                quantity: data.quantity,
                note: data.note,
            },
        });
        res.status(201).json(issue);
    } catch (error) {
        res.status(400).json({ message: "Error issuing item", error });
    }
};

export const returnItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Issue ID
        const issue = await prisma.inventoryIssue.update({
            where: { id: Number(id) },
            data: { returnDate: new Date() },
        });
        res.json(issue);
    } catch (error) {
        res.status(400).json({ message: "Error returning item", error });
    }
};

export const getIssuedItems = async (req: Request, res: Response) => {
    try {
        const issues = await prisma.inventoryIssue.findMany({
            where: { returnDate: null },
            include: { item: true },
        });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: "Error fetching issued items", error });
    }
};
