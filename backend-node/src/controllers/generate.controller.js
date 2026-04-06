import { generateRirekishoPDF } from "../services/convertToRirekisho.js";
import { prisma } from "../prisma.js";

export async function generateResume(req, res, next) {
    console.log("POST /generateResume hit");
    console.log("req.auth:", req.auth);


  const resumeData = req.body;
  const { userId } = req.auth();

  if (!resumeData || !resumeData.氏名) {
    return res.status(400).json({ error: "No resume data provided" });
  }

  try {
    const pdfBuffer = await generateRirekishoPDF(resumeData);

    await prisma.resume.create({
      data: {
        userId,
        original: JSON.stringify(resumeData),
        result: JSON.stringify(resumeData),
      },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=rirekisho.pdf",
    });
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}
