import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateRirekishoPDF(resumeData) {
    // 1. Read the HTML template
    let template = fs.readFileSync(
        path.join(__dirname, "../templates/rirekisho.html"),
        "utf-8"
    );

    // 2. Fill in today's date
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    template = template.replace("{{日付}}", dateStr);

    // 3. Fill in simple fields
    template = template.replace("{{氏名}}", resumeData.氏名 || "");
    template = template.replace("{{フリガナ}}", resumeData.フリガナ || "");
    template = template.replace("{{生年月日}}", resumeData.生年月日 || "");
    template = template.replace("{{住所}}", resumeData.住所 || "");
    template = template.replace("{{電話番号}}", resumeData.電話番号 || "");
    template = template.replace("{{メール}}", resumeData.メール || "");
    template = template.replace("{{志望動機}}", resumeData.志望動機 || "");
    template = template.replace("{{自己PR}}", resumeData.自己PR || "");

    // 4. Build rows for education (学歴)
    const gakurekiRows = (resumeData.学歴 || [])
        .map(item => {
            const parts = splitYearMonth(item.年月);
            return `<tr>
                <td style="border-right: 1px dashed #333333; width: 2.8em; text-align: center;">${parts.year}</td>
                <td style="border-left: 0; width: 1.2em; text-align: center;">${parts.month}</td>
                <td style="">${item.内容 || ""}</td>
            </tr>`;
        })
        .join("\n");
    template = template.replace("{{学歴_ROWS}}", gakurekiRows);

    // 5. Build rows for work history (職歴)
    const shokurekiRows = (resumeData.職歴 || [])
        .map(item => {
            const parts = splitYearMonth(item.年月);
            return `<tr>
                <td style="border-right: 1px dashed #333333; width: 2.8em; text-align: center;">${parts.year}</td>
                <td style="border-left: 0; width: 1.2em; text-align: center;">${parts.month}</td>
                <td style="">${item.内容 || ""}</td>
            </tr>`;
        })
        .join("\n");
    template = template.replace("{{職歴_ROWS}}", shokurekiRows);

    // 6. Build rows for licenses/certifications (免許・資格)
    const menkyoRows = (resumeData["免許・資格"] || [])
        .map(item => {
            const parts = splitYearMonth(item.年月);
            return `<tr>
                <td style="border-right: 1px dashed #333333; width: 2.8em; text-align: center;">${parts.year}</td>
                <td style="border-left: 0; width: 1.2em; text-align: center;">${parts.month}</td>
                <td style="">${item.内容 || ""}</td>
            </tr>`;
        })
        .join("\n");
    template = template.replace("{{免許資格_ROWS}}", menkyoRows);

    // 7. Launch Puppeteer and render to PDF
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" }
    });

    await browser.close();

    return pdfBuffer;
}

// Helper: splits "令和8年1月" into { year: "令和8年", month: "1" }
function splitYearMonth(yearMonth) {
    if (!yearMonth) return { year: "", month: "" };
    const match = yearMonth.match(/(.+年)\s*(\d+)月?/);
    if (match) {
        return { year: match[1], month: match[2] };
    }
    return { year: yearMonth, month: "" };
}