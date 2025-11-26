import type { Request, Response } from "express";
import prisma from "../utility/prisma";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            studentCount,
            staffCount,
            classCount,
            parentCount,
            totalFeesCollected,
            totalExpenses,
        ] = await Promise.all([
            prisma.student.count(),
            prisma.staff.count(),
            prisma.class.count(),
            prisma.parent.count(),
            prisma.feePayment.aggregate({ _sum: { amount: true } }),
            prisma.expense.aggregate({ _sum: { amount: true } }),
        ]);

        res.json({
            students: studentCount,
            staff: staffCount,
            classes: classCount,
            parents: parentCount,
            financials: {
                collected: totalFeesCollected._sum.amount || 0,
                expenses: totalExpenses._sum.amount || 0,
                balance: (totalFeesCollected._sum.amount || 0) - (totalExpenses._sum.amount || 0),
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error });
    }
};

export const getRecentActivities = async (req: Request, res: Response) => {
    try {
        const [recentNotices, recentEvents] = await Promise.all([
            prisma.notice.findMany({ take: 5, orderBy: { date: "desc" } }),
            // Assuming Event model exists, otherwise return empty
            // prisma.event.findMany({ take: 5, orderBy: { startDate: "desc" } }),
            Promise.resolve([]),
        ]);

        res.json({
            notices: recentNotices,
            events: recentEvents,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching recent activities", error });
    }
};

export const getAttendanceOverview = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [studentAttendance, staffAttendance] = await Promise.all([
            prisma.studentAttendance.groupBy({
                by: ["status"],
                where: { date: today },
                _count: { status: true },
            }),
            prisma.staffAttendance.groupBy({
                by: ["status"],
                where: { date: today },
                _count: { status: true },
            }),
        ]);

        res.json({
            student: studentAttendance,
            staff: staffAttendance,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance overview", error });
    }
};
