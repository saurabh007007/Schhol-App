import express from "express";
import authRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // to allow cookies to be sent
};
app.use(cors(corsOptions));

dotenv.config();
console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/v2/auth", authRoutes);
//admin routes
app.use("/api/v2/admin", adminRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
