import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { upload } from "./middleware/upload.middleware.js";
import { extractTextFromPDF } from "./services/extractText.js";
import { transformResume } from "./services/ai.js";
import { parseResume } from "./services/cleanResume.js";
// import pkg from "@prisma/client";
import { errorHandler } from "./middleware/error.middleware.js";
import { generateRirekishoPDF } from "./services/convert.js";

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
app.post("/extractText", upload.single("resume"), async (req, res, next) => {
    console.log("POST /extractText hit");

    if (!req.file) {
        return res.status(400).json({ error: "No resume detected!" });
    }

    try {
        const resumeText = await extractTextFromPDF(req.file.buffer);
        const cleaned = parseResume(resumeText);
        const result = await transformResume(cleaned);

        if (result.error) {
            return res.status(422).json(result);
        }

        // Check which fields the AI couldn't fill
        const missingFields = [];
        if (!result.氏名) missingFields.push({ field: "氏名", question: "What is your full name?" });
        if (!result.フリガナ) missingFields.push({ field: "フリガナ", question: "What is the katakana reading of your name?" });
        if (!result.生年月日) missingFields.push({ field: "生年月日", question: "What is your date of birth?" });
        if (!result.住所) missingFields.push({ field: "住所", question: "What is your address in Japan?" });
        if (!result.電話番号) missingFields.push({ field: "電話番号", question: "What is your phone number?" });
        if (!result.メール) missingFields.push({ field: "メール", question: "What is your email address?" });
        if (!result.志望動機) missingFields.push({ field: "志望動機", question: "Why are you applying for this position?" });
        if (!result.自己PR) missingFields.push({ field: "自己PR", question: "Describe your strengths and what you bring to the role." });

        res.json({ result, missingFields });

    } catch (err) {
        next(err);
    }
});

app.post("/generateResume", async (req, res, next) => {
    console.log("POST /generateResume hit");
    
    const resumeData = req.body;

    if (!resumeData || !resumeData.氏名) {
        return res.status(400).json({ error: "No resume data provided"});
    }

    try {
        const pdfBuffer = await generateRirekishoPDF(resumeData);

        res.set ({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=rirekisho.pdf"
        });
        res.send(pdfBuffer);
    } catch (err) {
        next(err);
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});