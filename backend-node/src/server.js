import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { upload } from "./middleware/upload.middleware.js";
import { extractAndClean } from "./controllers/extract.controller.js";
import { generateResume } from "./controllers/generate.controller.js";

// import pkg from "@prisma/client";
import { errorHandler } from "./middleware/error.middleware.js";

// const { PrismaClient } = pkg;
// const prisma = new PrismaClient();
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is online");
});

// upload.single("resume") tells multer to expect a file field named "resume"
app.post("/extractText", upload.single("resume"), extractAndClean);

app.post("/generateResume", generateResume);

app.post("/advice", );

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});