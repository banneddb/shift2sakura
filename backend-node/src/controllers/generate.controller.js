import { generateRirekishoPDF } from "../services/convertToRirekisho.js";

export async function generateResume(req,res,next) {
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
};