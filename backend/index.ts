import express from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";

import settingsRoutes from "./routes/settings.routes";
import staffRoutes from "./routes/staff.routes";
import studentRoutes from "./routes/student.routes";
import academicRoutes from "./routes/academic.routes";
import attendanceRoutes from "./routes/attendance.routes";
import leaveRoutes from "./routes/leave.routes";
import feeRoutes from "./routes/fee.routes";
import libraryRoutes from "./routes/library.routes";
import transportRoutes from "./routes/transport.routes";
import inventoryRoutes from "./routes/inventory.routes";
import communicationRoutes from "./routes/communication.routes";
import examRoutes from "./routes/exam.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import dotenv from "dotenv";
import cors from "cors";



const app = express();

// const corsOptions = {
//   origin: "*", // frontend URL
//   credentials: true, // to allow cookies to be sent
// };
app.use(cookieParser())
// app.use(cors(corsOptions));
app.use(cors({ origin: "*", credentials: true }));


dotenv.config();
console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/v2/auth", authRoutes);
//admin routes - REMOVED (Use specific module routes instead)
// app.use("/api/v2/admin", adminRoutes);
//settings routes
app.use("/api/v2/settings", settingsRoutes);
//staff routes
app.use("/api/v2/staff", staffRoutes);
//student routes
app.use("/api/v2/student", studentRoutes);
//academic routes
app.use("/api/v2/academic", academicRoutes);
//attendance routes
app.use("/api/v2/attendance", attendanceRoutes);
//leave routes
app.use("/api/v2/leave", leaveRoutes);
//fee routes
app.use("/api/v2/fee", feeRoutes);
//library routes
app.use("/api/v2/library", libraryRoutes);
//transport routes
app.use("/api/v2/transport", transportRoutes);
//inventory routes
app.use("/api/v2/inventory", inventoryRoutes);
//communication routes
app.use("/api/v2/communication", communicationRoutes);
//exam routes
app.use("/api/v2/exam", examRoutes);
//dashboard routes
app.use("/api/v2/dashboard", dashboardRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
