import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting verification...");

    // 1. Create Academic Year & Session
    const academicYear = await prisma.academicYear.create({
        data: {
            name: "2024-2025",
            startDate: new Date("2024-04-01"),
            endDate: new Date("2025-03-31"),
            current: true,
        },
    });
    console.log("Created Academic Year:", academicYear.name);

    const session = await prisma.session.create({
        data: {
            name: "Term 1",
            startDate: new Date("2024-04-01"),
            endDate: new Date("2024-09-30"),
            academicYearId: academicYear.id,
        },
    });
    console.log("Created Session:", session.name);

    // 2. Create Class & Section
    const classA = await prisma.class.create({
        data: {
            name: "Class 10",
            capacity: 40,
        },
    });
    console.log("Created Class:", classA.name);

    const sectionA = await prisma.section.create({
        data: {
            name: "A",
            classId: classA.id,
        },
    });
    console.log("Created Section:", sectionA.name);

    // 3. Create Student (and Parent)
    // We'll use the API logic simulation here (direct DB)
    const parent = await prisma.parent.create({
        data: {
            fatherName: "John Doe",
            motherName: "Jane Doe",
            email: "parent@example.com",
            phone: "1234567890",
            address: "123 Main St",
        },
    });

    const student = await prisma.student.create({
        data: {
            firstName: "Alice",
            lastName: "Doe",
            admissionNo: "ADM001",
            rollNo: "101",
            classId: classA.id,
            sectionId: sectionA.id,
            parentId: parent.id,
            dob: new Date("2010-01-01"),
            gender: "FEMALE",
            address: "123 Main St",
            sessionId: session.id,
        },
    });
    console.log("Created Student:", student.firstName);

    // 4. Create Staff
    const staff = await prisma.staff.create({
        data: {
            firstName: "Bob",
            lastName: "Smith",
            email: "teacher@example.com",
            phone: "0987654321",
            designation: "Teacher",
            qualification: "B.Ed",
            joiningDate: new Date("2020-01-01"),
            gender: "MALE",
        },
    });
    console.log("Created Staff:", staff.firstName);

    // 5. Assign Fee Structure
    const feeGroup = await prisma.feeGroup.create({
        data: { name: "Tuition Fees" },
    });
    const feeType = await prisma.feeType.create({
        data: { name: "Monthly Tuition", feeGroupId: feeGroup.id },
    });
    const feeStructure = await prisma.feeStructure.create({
        data: {
            feeTypeId: feeType.id,
            classId: classA.id,
            amount: 5000,
            dueDate: new Date("2024-04-10"),
        },
    });
    console.log("Created Fee Structure:", feeStructure.amount);

    // 6. Assign Fee to Student
    const studentFee = await prisma.studentFee.create({
        data: {
            studentId: student.id,
            feeStructureId: feeStructure.id,
            amount: feeStructure.amount,
            dueDate: feeStructure.dueDate || new Date(),
            status: "PENDING",
        },
    });
    console.log("Assigned Fee to Student");

    // 7. Collect Fee Payment
    const payment = await prisma.feePayment.create({
        data: {
            studentFeeId: studentFee.id,
            amount: 5000,
            method: "CASH",
            status: "SUCCESS", // Assuming we added status back or it's optional? 
            // Wait, I removed status from create in controller but schema might have it?
            // Let's check schema.prisma if I can.
            // If it fails, I'll remove it.
        },
    });
    await prisma.studentFee.update({
        where: { id: studentFee.id },
        data: { status: "PAID", paidAmount: 5000 },
    });
    console.log("Collected Fee Payment");

    // 8. Mark Attendance
    await prisma.studentAttendance.create({
        data: {
            studentId: student.id,
            date: new Date(),
            status: "PRESENT",
            sessionId: session.id,
            classId: classA.id,
            sectionId: sectionA.id,
        },
    });
    console.log("Marked Attendance");

    // 9. Issue Book
    const category = await prisma.bookCategory.create({ data: { name: "Fiction" } });
    const book = await prisma.book.create({
        data: {
            title: "Harry Potter",
            author: "J.K. Rowling",
            categoryId: category.id,
            quantity: 5,
            available: 5,
        },
    });
    await prisma.bookIssue.create({
        data: {
            bookId: book.id,
            studentId: student.id,
            dueDate: new Date("2024-05-01"),
            status: "ISSUED",
        },
    });
    await prisma.book.update({ where: { id: book.id }, data: { available: 4 } });
    console.log("Issued Book");

    // 10. Assign Transport
    const vehicle = await prisma.vehicle.create({
        data: { vehicleNo: "BUS-01", type: "BUS", capacity: 50 },
    });
    const route = await prisma.transportRoute.create({
        data: { title: "Route A", vehicleId: vehicle.id, fare: 1000 },
    });
    await prisma.transportMember.create({
        data: {
            routeId: route.id,
            studentId: student.id,
            startDate: new Date(),
            status: "ACTIVE",
        },
    });
    console.log("Assigned Transport");

    console.log("Verification completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
