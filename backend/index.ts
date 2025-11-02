import express from "express";
import authRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
const app = express();
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/v2/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
