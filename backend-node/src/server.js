import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { prisma } from "./prisma.js";
import { upload } from "./middleware/upload.middleware.js";
import { extractAndClean } from "./controllers/extract.controller.js";
import { generateResume } from "./controllers/generate.controller.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server is online");
});

app.get("/myResumes", requireAuth(), async (req, res, next) => {
  const { userId } = req.auth();
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(resumes);
  } catch (err) {
    next(err);
  }
});

app.post(
  "/extractText",
  requireAuth(),
  upload.single("resume"),
  extractAndClean,
);
app.post("/generateResume", requireAuth(), generateResume);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
