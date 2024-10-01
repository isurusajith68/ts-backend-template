import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.use("/api", userRoutes);

export default app;
