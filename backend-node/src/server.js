import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

// POST /transform → run this function. Frontend API endpoints exposed.
app.post("/transform", async (req, res) => {
    console.log("POST /transform hit");
  
    const { resumeText } = req.body;
  
    if (!resumeText) {
      return res.status(400).json({ error: "No resume detected!" });
    }
  
    try {
      const parsed = parseResume(resumeText);
      const result = await transformResume(JSON.stringify(parsed));
  
      res.json({ result });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "AI failed" });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});