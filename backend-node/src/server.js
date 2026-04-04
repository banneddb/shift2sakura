import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { upload } from "./middleware/upload.middleware.js";
import { extractTextFromPDF } from "./services/pdf.js";
import { transformResume } from "./services/ai.js";
import { parseResume } from "./services/parse.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is online");
});

// upload.single("resume") tells multer to expect a file field named "resume"
app.post("/transform", upload.single("resume"), async (req, res) => {
    console.log("POST /transform hit");

    if (!req.file) {
        return res.status(400).json({ error: "No resume detected!" });
    }

    try {
    console.log("Step 1: Extracting text from PDF...");
    const resumeText = await extractTextFromPDF(req.file.buffer);
    console.log("Extracted text:", resumeText.substring(0, 200));

    console.log("Step 2: Cleaning text...");
    const cleaned = parseResume(resumeText);
    console.log("Cleaned text:", cleaned.substring(0, 200));

    console.log("Step 3: Sending to AI...");
    const result = await transformResume(cleaned);
    console.log("AI result:", result);

    res.json({ result });
} catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: "Processing failed" });
}
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});