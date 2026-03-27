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
        const resumeText = await extractTextFromPDF(req.file.buffer);
        const parsed = parseResume(resumeText);
        const result = await transformResume(JSON.stringify(parsed));

        res.json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Processing failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});