import {
  PrismaClient,
  Role,
  Gender,
  BloodGroup,
  Religion,
  Status,
  AttendanceStatus,
  LeaveStatus,
  PaymentMethod,
  PaymentStatus,
  BookStatus,
  VehicleType,
} from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // 1. School Profile
  const schoolProfile = await prisma.schoolProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Springfield High School",
      address: "742 Evergreen Terrace, Springfield",
      phone: "+1-555-0123",
      email: "info@springfieldhigh.edu",
      website: "https://springfieldhigh.edu",
      academicYear: "2024-2025",
    },
  });
  console.log("Created/Updated School Profile:", schoolProfile.name);

  // 2. Academic Year
  let academicYear = await prisma.academicYear.findFirst({
    where: { name: "2024-2025" },
  });

  if (!academicYear) {
    academicYear = await prisma.academicYear.create({
      data: {
        name: "2024-2025",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2025-03-31"),
        isCurrent: true,
        sessions: {
          create: [
            {
              name: "Term 1",
              startDate: new Date("2024-04-01"),
              endDate: new Date("2024-09-30"),
            },
            {
              name: "Term 2",
              startDate: new Date("2024-10-01"),
              endDate: new Date("2025-03-31"),
            },
          ],
        },
      },
    });
    console.log("Created Academic Year:", academicYear.name);
  } else {
    console.log("Academic Year already exists:", academicYear.name);
  }

  // 3. Departments
  const scienceDept = await prisma.department.upsert({
    where: { name: "Science" },
    update: {},
    create: {
      name: "Science",
      description: "Physics, Chemistry, Biology",
    },
  });

  const mathDept = await prisma.department.upsert({
    where: { name: "Mathematics" },
    update: {},
    create: {
      name: "Mathematics",
      description: "Algebra, Geometry, Calculus",
    },
  });
  console.log("Created/Updated Departments");

  // 4. Users & Staff (Admin & Teachers)
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      email: "admin@school.com",
      role: Role.ADMIN,
      staff: {
        create: {
          firstName: "Principal",
          lastName: "Skinner",
          dateOfBirth: new Date("1970-01-01"),
          gender: Gender.MALE,
          joiningDate: new Date("2010-01-01"),
          designation: "Principal",
          address: "Springfield",
        },
      },
    },
  });
  console.log("Created/Updated Admin:", adminUser.username);

  // Teacher 1
  const teacher1 = await prisma.user.upsert({
    where: { username: "walter.white" },
    update: {},
    create: {
      username: "walter.white",
      password: hashedPassword,
      email: "walter@school.com",
      role: Role.TEACHER,
      staff: {
        create: {
          firstName: "Walter",
          lastName: "White",
          dateOfBirth: new Date("1980-05-15"),
          gender: Gender.MALE,
          joiningDate: new Date("2015-08-01"),
          designation: "Senior Chemistry Teacher",
          qualification: "M.Sc Chemistry",
          departmentId: scienceDept.id,
          address: "308 Negra Arroyo Lane, Albuquerque",
        },
      },
    },
  });

  // Teacher 2
  const teacher2 = await prisma.user.upsert({
    where: { username: "katherine.johnson" },
    update: {},
    create: {
      username: "katherine.johnson",
      password: hashedPassword,
      email: "katherine@school.com",
      role: Role.TEACHER,
      staff: {
        create: {
          firstName: "Katherine",
          lastName: "Johnson",
          dateOfBirth: new Date("1985-08-26"),
          gender: Gender.FEMALE,
          joiningDate: new Date("2018-08-01"),
          designation: "Senior Math Teacher",
          qualification: "Ph.D Mathematics",
          departmentId: mathDept.id,
          address: "Hampton, Virginia",
        },
      },
    },
  });
  console.log("Created/Updated Teachers");

  // 5. Classes & Sections
  const class10 = await prisma.class.upsert({
    where: { name: "Class 10" },
    update: {},
    create: {
      name: "Class 10",
      numeric: 10,
      sections: {
        create: [
          { name: "A", capacity: 40 },
          { name: "B", capacity: 40 },
        ],
      },
    },
  });

  const class10SectionA = await prisma.section.findFirst({
    where: { name: "A", classId: class10.id },
  });

  console.log("Created/Updated Classes & Sections");

  // 6. Subjects
  let physics = await prisma.subject.findFirst({ where: { name: "Physics" } });
  if (!physics) {
    physics = await prisma.subject.create({
      data: { name: "Physics", code: "PHY101", type: "Theory" },
    });
  }

  let math = await prisma.subject.findFirst({ where: { name: "Mathematics" } });
  if (!math) {
    math = await prisma.subject.create({
      data: { name: "Mathematics", code: "MAT101", type: "Theory" },
    });
  }

  // Subject Allocation
  const t1Staff = await prisma.staff.findUnique({
    where: { userId: teacher1.id },
  });
  const t2Staff = await prisma.staff.findUnique({
    where: { userId: teacher2.id },
  });

  let physicsAlloc;
  let mathAlloc;

  if (t1Staff && t2Staff && physics && math) {
    physicsAlloc = await prisma.subjectAllocation.findFirst({
      where: {
        classId: class10.id,
        subjectId: physics.id,
        teacherId: t1Staff.id,
      },
    });
    if (!physicsAlloc) {
      physicsAlloc = await prisma.subjectAllocation.create({
        data: {
          classId: class10.id,
          subjectId: physics.id,
          teacherId: t1Staff.id,
        },
      });
    }

    mathAlloc = await prisma.subjectAllocation.findFirst({
      where: { classId: class10.id, subjectId: math.id, teacherId: t2Staff.id },
    });
    if (!mathAlloc) {
      mathAlloc = await prisma.subjectAllocation.create({
        data: {
          classId: class10.id,
          subjectId: math.id,
          teacherId: t2Staff.id,
        },
      });
    }
    console.log("Allocated Subjects");
  }

  // 7. Parents & Students
  const parentUser = await prisma.user.upsert({
    where: { username: "homer.simpson" },
    update: {},
    create: {
      username: "homer.simpson",
      password: hashedPassword,
      email: "homer@simpson.com",
      role: Role.PARENT,
      parent: {
        create: {
          fatherName: "Homer Simpson",
          motherName: "Marge Simpson",
          address: "742 Evergreen Terrace",
          phone: "6578095432",
        },
      },
    },
  });

  const parentRecord = await prisma.parent.findUnique({
    where: { userId: parentUser.id },
  });

  let studentRecord;

  if (parentRecord && class10SectionA && academicYear) {
    const studentUser = await prisma.user.upsert({
      where: { username: "bart.simpson" },
      update: {},
      create: {
        username: "bart.simpson",
        password: hashedPassword,
        role: Role.STUDENT,
        student: {
          create: {
            firstName: "Bart",
            lastName: "Simpson",
            admissionNo: "ADM2024001",
            rollNumber: "101",
            dateOfBirth: new Date("2010-04-01"),
            gender: Gender.MALE,
            bloodGroup: BloodGroup.B_POSITIVE,
            religion: Religion.CHRISTIAN,
            classId: class10.id,
            sectionId: class10SectionA.id,
            academicYearId: academicYear.id,
            parentId: parentRecord.id,
            address: "742 Evergreen Terrace",
          },
        },
      },
    });
    studentRecord = await prisma.student.findUnique({
      where: { userId: studentUser.id },
    });
    console.log("Created/Updated Student & Parent:", studentUser.username);
  }

  // 8. Academic Management (TimeTable, Holidays)
  if (class10SectionA && physicsAlloc) {
    const timeTableEntry = await prisma.timeTable.findFirst({
      where: {
        classId: class10.id,
        sectionId: class10SectionA.id,
        dayOfWeek: "Monday",
        startTime: "09:00",
      },
    });

    if (!timeTableEntry) {
      await prisma.timeTable.create({
        data: {
          classId: class10.id,
          sectionId: class10SectionA.id,
          subjectId: physicsAlloc.id,
          dayOfWeek: "Monday",
          startTime: "09:00",
          endTime: "10:00",
          roomNo: "101",
        },
      });
      console.log("Created TimeTable Entry");
    }
  }

  const holiday = await prisma.holiday.findFirst({
    where: { title: "Summer Vacation" },
  });
  if (!holiday) {
    await prisma.holiday.create({
      data: {
        title: "Summer Vacation",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-06-30"),
        type: "Public",
      },
    });
    console.log("Created Holiday");
  }

  // 9. Attendance Management
  if (studentRecord) {
    const attendance = await prisma.studentAttendance.findUnique({
      where: {
        studentId_date: {
          studentId: studentRecord.id,
          date: new Date("2024-04-02"),
        },
      },
    });

    if (!attendance) {
      await prisma.studentAttendance.create({
        data: {
          studentId: studentRecord.id,
          date: new Date("2024-04-02"),
          status: AttendanceStatus.PRESENT,
        },
      });
      console.log("Created Student Attendance");
    }
  }

  if (t1Staff) {
    const staffAttendance = await prisma.staffAttendance.findUnique({
      where: {
        staffId_date: {
          staffId: t1Staff.id,
          date: new Date("2024-04-02"),
        },
      },
    });

    if (!staffAttendance) {
      await prisma.staffAttendance.create({
        data: {
          staffId: t1Staff.id,
          date: new Date("2024-04-02"),
          status: AttendanceStatus.PRESENT,
          checkIn: new Date("2024-04-02T08:00:00"),
          checkOut: new Date("2024-04-02T16:00:00"),
        },
      });
      console.log("Created Staff Attendance");
    }

    const leave = await prisma.leaveApplication.findFirst({
      where: { staffId: t1Staff.id, startDate: new Date("2024-05-01") },
    });

    if (!leave) {
      await prisma.leaveApplication.create({
        data: {
          staffId: t1Staff.id,
          type: "Sick Leave",
          startDate: new Date("2024-05-01"),
          endDate: new Date("2024-05-02"),
          reason: "Fever",
          status: LeaveStatus.PENDING,
        },
      });
      console.log("Created Leave Application");
    }
  }

  // 10. Homework
  if (physicsAlloc && studentRecord) {
    let homework = await prisma.homework.findFirst({
      where: { title: "Physics Assignment 1" },
    });

    if (!homework) {
      homework = await prisma.homework.create({
        data: {
          classId: class10.id,
          subjectId: physicsAlloc.id,
          title: "Physics Assignment 1",
          description: "Solve chapter 1 problems",
          assignedDate: new Date("2024-04-10"),
          dueDate: new Date("2024-04-15"),
        },
      });
      console.log("Created Homework");
    }

    const submission = await prisma.homeworkSubmission.findFirst({
      where: { homeworkId: homework.id, studentId: studentRecord.id },
    });

    if (!submission) {
      await prisma.homeworkSubmission.create({
        data: {
          homeworkId: homework.id,
          studentId: studentRecord.id,
          submissionDate: new Date("2024-04-14"),
          remarks: "Good work",
        },
      });
      console.log("Created Homework Submission");
    }
  }

  // 11. Exams
  let exam = await prisma.exam.findFirst({ where: { name: "Mid-Term 2024" } });
  if (!exam) {
    exam = await prisma.exam.create({
      data: {
        name: "Mid-Term 2024",
        startDate: new Date("2024-09-15"),
        endDate: new Date("2024-09-25"),
      },
    });
    console.log("Created Exam");
  }

  if (exam && physics && studentRecord) {
    const schedule = await prisma.examSchedule.findFirst({
      where: { examId: exam.id, subjectId: physics.id, classId: class10.id },
    });

    if (!schedule) {
      await prisma.examSchedule.create({
        data: {
          examId: exam.id,
          classId: class10.id,
          subjectId: physics.id,
          date: new Date("2024-09-16"),
          startTime: "10:00",
          endTime: "13:00",
          maxMarks: 100,
          minMarks: 35,
        },
      });
      console.log("Created Exam Schedule");
    }

    const result = await prisma.examResult.findFirst({
      where: {
        examId: exam.id,
        studentId: studentRecord.id,
        subjectId: physics.id,
      },
    });

    if (!result) {
      await prisma.examResult.create({
        data: {
          examId: exam.id,
          studentId: studentRecord.id,
          subjectId: physics.id,
          marksObtained: 85,
          grade: "A",
        },
      });
      console.log("Created Exam Result");
    }
  }

  // 12. Fees
  let feeGroup = await prisma.feeGroup.findFirst({
    where: { name: "Tuition" },
  });
  if (!feeGroup) {
    feeGroup = await prisma.feeGroup.create({
      data: { name: "Tuition", description: "Academic Fees" },
    });
  }

  let feeType = await prisma.feeType.findFirst({
    where: { name: "Term 1 Fee" },
  });
  if (!feeType && feeGroup) {
    feeType = await prisma.feeType.create({
      data: {
        feeGroupId: feeGroup.id,
        name: "Term 1 Fee",
        code: "T1-2024",
      },
    });
  }

  if (feeType) {
    let feeStructure = await prisma.feeStructure.findFirst({
      where: { feeTypeId: feeType.id, classId: class10.id },
    });

    if (!feeStructure) {
      feeStructure = await prisma.feeStructure.create({
        data: {
          feeTypeId: feeType.id,
          classId: class10.id,
          amount: 5000,
          dueDate: new Date("2024-04-10"),
        },
      });
      console.log("Created Fee Structure");
    }

    if (studentRecord && feeStructure) {
      let studentFee = await prisma.studentFee.findFirst({
        where: { studentId: studentRecord.id, feeStructureId: feeStructure.id },
      });

      if (!studentFee) {
        studentFee = await prisma.studentFee.create({
          data: {
            studentId: studentRecord.id,
            feeStructureId: feeStructure.id,
            amount: 5000,
            dueDate: new Date("2024-04-10"),
            status: PaymentStatus.PAID,
            paidAmount: 5000,
          },
        });
        console.log("Created Student Fee");

        await prisma.feePayment.create({
          data: {
            studentFeeId: studentFee.id,
            amount: 5000,
            method: PaymentMethod.ONLINE,
            transactionId: "TXN123456",
          },
        });
        console.log("Created Fee Payment");
      }
    }
  }

  // 13. Library
  let bookCategory = await prisma.bookCategory.findFirst({
    where: { name: "Science Fiction" },
  });
  if (!bookCategory) {
    bookCategory = await prisma.bookCategory.create({
      data: { name: "Science Fiction" },
    });
  }

  let book = await prisma.book.findFirst({ where: { title: "Dune" } });
  if (!book && bookCategory) {
    book = await prisma.book.create({
      data: {
        title: "Dune",
        author: "Frank Herbert",
        categoryId: bookCategory.id,
        quantity: 5,
        available: 4,
      },
    });
    console.log("Created Book");
  }

  if (book && studentRecord) {
    // Check if issued
    // Since we don't have a unique constraint on bookId + studentId + issueDate easily accessible without exact date,
    // we'll just check if there's any active issue for this book and student.
    const issue = await prisma.bookIssue.findFirst({
      where: {
        bookId: book.id,
        studentId: studentRecord.id,
        status: BookStatus.ISSUED,
      },
    });

    if (!issue) {
      await prisma.bookIssue.create({
        data: {
          bookId: book.id,
          studentId: studentRecord.id,
          dueDate: new Date("2024-05-01"),
          status: BookStatus.ISSUED,
        },
      });
      console.log("Created Book Issue");
    }
  }

  // 14. Transport
  let vehicle = await prisma.vehicle.findUnique({
    where: { vehicleNo: "BUS-01" },
  });
  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        vehicleNo: "BUS-01",
        type: VehicleType.BUS,
        capacity: 50,
        driverName: "Otto Mann",
        driverPhone: "555-9999",
      },
    });
    console.log("Created Vehicle");
  }

  if (vehicle) {
    let route = await prisma.transportRoute.findFirst({
      where: { title: "Route 1" },
    });
    if (!route) {
      route = await prisma.transportRoute.create({
        data: {
          title: "Route 1",
          vehicleId: vehicle.id,
          fare: 1000,
        },
      });
      console.log("Created Transport Route");
    }

    if (route) {
      const stop = await prisma.transportStop.findFirst({
        where: { routeId: route.id, name: "Evergreen Terrace" },
      });
      if (!stop) {
        await prisma.transportStop.create({
          data: {
            routeId: route.id,
            name: "Evergreen Terrace",
            pickupTime: "07:30",
            dropTime: "15:30",
          },
        });
      }

      if (studentRecord) {
        const member = await prisma.transportMember.findFirst({
          where: { studentId: studentRecord.id, routeId: route.id },
        });
        if (!member) {
          await prisma.transportMember.create({
            data: {
              routeId: route.id,
              studentId: studentRecord.id,
              pickupPoint: "Evergreen Terrace",
              startDate: new Date("2024-04-01"),
            },
          });
          console.log("Created Transport Member");
        }
      }
    }
  }

  // 15. Inventory
  let invCategory = await prisma.inventoryCategory.findFirst({
    where: { name: "Stationery" },
  });
  if (!invCategory) {
    invCategory = await prisma.inventoryCategory.create({
      data: { name: "Stationery" },
    });
  }

  if (invCategory) {
    let item = await prisma.inventoryItem.findFirst({
      where: { name: "Whiteboard Marker" },
    });
    if (!item) {
      item = await prisma.inventoryItem.create({
        data: {
          name: "Whiteboard Marker",
          categoryId: invCategory.id,
          unit: "Box",
        },
      });
      console.log("Created Inventory Item");
    }

    if (item) {
      // Stock
      const stock = await prisma.inventoryStock.findFirst({
        where: { itemId: item.id },
      });
      if (!stock) {
        await prisma.inventoryStock.create({
          data: {
            itemId: item.id,
            quantity: 100,
            purchasePrice: 500,
            purchaseDate: new Date("2024-03-01"),
          },
        });
      }

      // Issue
      if (t1Staff) {
        const issue = await prisma.inventoryIssue.findFirst({
          where: { itemId: item.id, issuedBy: adminUser.id },
        });
        if (!issue) {
          await prisma.inventoryIssue.create({
            data: {
              itemId: item.id,
              issuedTo: "Science Dept",
              issuedBy: adminUser.id,
              quantity: 2,
            },
          });
          console.log("Created Inventory Issue");
        }
      }
    }
  }

  // 16. Communication & Others
  const notice = await prisma.notice.findFirst({
    where: { title: "Welcome Back" },
  });
  if (!notice) {
    await prisma.notice.create({
      data: {
        title: "Welcome Back",
        content: "Welcome to the new academic year!",
        postedBy: adminUser.id,
        targetRole: [Role.STUDENT, Role.TEACHER, Role.PARENT],
      },
    });
    console.log("Created Notice");
  }

  if (t1Staff && adminUser) {
    const message = await prisma.message.findFirst({
      where: { senderId: adminUser.id, receiverId: t1Staff.userId },
    });
    if (!message) {
      await prisma.message.create({
        data: {
          senderId: adminUser.id,
          receiverId: t1Staff.userId,
          content: "Please submit lesson plans.",
        },
      });
      console.log("Created Message");
    }
  }

  if (studentRecord) {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNo: "CERT-001" },
    });
    if (!cert) {
      await prisma.certificate.create({
        data: {
          studentId: studentRecord.id,
          type: "Merit",
          issueDate: new Date("2024-03-31"),
          certificateNo: "CERT-001",
        },
      });
      console.log("Created Certificate");
    }

    const discipline = await prisma.disciplineRecord.findFirst({
      where: { studentId: studentRecord.id, title: "Late Coming" },
    });
    if (!discipline) {
      await prisma.disciplineRecord.create({
        data: {
          studentId: studentRecord.id,
          title: "Late Coming",
          description: "Arrived late to class",
          actionTaken: "Warning",
        },
      });
      console.log("Created Discipline Record");
    }
  }

  const visitor = await prisma.visitor.findFirst({
    where: { name: "Barney Gumble" },
  });
  if (!visitor) {
    await prisma.visitor.create({
      data: {
        name: "Barney Gumble",
        phone: "555-1111",
        purpose: "Meeting Principal",
        personToMeet: "Principal Skinner",
      },
    });
    console.log("Created Visitor");
  }

  const alumni = await prisma.alumni.findFirst({
    where: { name: "Lenny Leonard" },
  });
  if (!alumni) {
    await prisma.alumni.create({
      data: {
        name: "Lenny Leonard",
        passOutYear: "2000",
        currentStatus: "Working at Nuclear Plant",
      },
    });
    console.log("Created Alumni");
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
