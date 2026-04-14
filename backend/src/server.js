import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import ruleRoutes from "./routes/ruleRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import validationRoutes from "./routes/validationRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/validate", validationRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/uploads", express.static(env.uploadDir));

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();

