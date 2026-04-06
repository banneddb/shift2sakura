
"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

type MissingField = {
  field: string;
  question: string;
  advice?: string[];
};

type ResumeData = Record<string, string>;

export default function ResumeConverter() {
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  // Step 1 result
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [missingFields, setMissingFields] = useState<MissingField[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Step 2 result
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Step 1 — extract and transform resume
  async function handleConvert() {
    if (!file || !role) return;

    const token = await getToken();

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", role);

    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/extractText`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Something went wrong.");

      const data = await res.json();
      setResumeData(data.result);
      setMissingFields(data.missingFields || []);

      // Pre-fill answers with whatever the AI already found
      const prefilled: Record<string, string> = {};
      data.missingFields?.forEach((f: MissingField) => {
        prefilled[f.field] = "";
      });
      setAnswers(prefilled);
    } catch (err) {
      setError("Failed to extract resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2 — generate PDF with completed data
  async function handleGenerate() {
    if (!resumeData) return;

    const token = await getToken();
    const completed = { ...resumeData, ...answers };

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generateResume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(completed),
        },
      );

      if (!res.ok) throw new Error("Failed to generate resume.");

      // Convert PDF buffer to a URL the browser can display
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="px-12 py-16">
      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
        resume converter
      </p>
      <h1 className="mb-12 font-serif text-[clamp(2.2rem,5vw,4rem)] font-black leading-tight tracking-tight">
        Turn your resume into{" "}
        something <em className="italic text-[#e8759a]"> they will read.</em>
      </h1>

      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200">
        {/* Left — inputs */}
        <div className="flex flex-col gap-5 p-8 border-r border-gray-100">
          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center hover:bg-gray-100 transition-colors">
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <svg
              className="w-9 h-9 text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
            </svg>
            <span className="text-sm text-gray-400 leading-relaxed">
              {file ? (
                <span className="text-[#993556] font-medium">{file.name}</span>
              ) : (
                <>
                  <span className="text-[#993556] font-medium">
                    Click to upload
                  </span>{" "}
                  or drag & drop
                  <br />
                  PDF or DOCX
                </>
              )}
            </span>
          </label>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Job description / target role
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer, Tokyo"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#993556] transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            onClick={handleConvert}
            disabled={!file || !role || loading}
            className="mt-auto rounded-lg bg-[#993556] py-3 text-sm font-medium tracking-wide text-white hover:bg-[#7a2843] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Extracting..." : "Convert !"}
          </button>
        </div>

        {/* Right — output */}
        <div className="flex flex-col gap-6 bg-gray-50 p-8">
          {!resumeData ? (
            <p className="text-sm text-gray-300 m-auto">
              Your results will appear here.
            </p>
          ) : missingFields.length > 0 ? (
            <>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                We need a few more details
              </p>
              <div className="flex flex-col gap-4">
                {missingFields.map((f) => (
                  <div key={f.field} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      {f.question}
                    </label>
                    {f.advice && f.advice.length > 0 && (
                      <div className="flex flex-col gap-1 rounded-lg bg-white border border-gray-100 p-2.5">
                        {f.advice.map((bullet, i) => (
                          <p
                            key={i}
                            className="text-xs text-gray-400 leading-relaxed"
                          >
                            {bullet}
                          </p>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={answers[f.field] || ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [f.field]: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#993556] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-lg bg-[#993556] py-3 text-sm font-medium tracking-wide text-white hover:bg-[#7a2843] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating ? "Generating..." : "Generate Resume"}
              </button>
            </>
          ) : (
            // No missing fields — go straight to generate
            <div className="flex flex-col gap-4 m-auto items-center text-center">
              <p className="text-sm text-gray-500">
                Resume extracted successfully. Ready to generate your Rirekisho.
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-lg bg-[#993556] px-6 py-3 text-sm font-medium text-white hover:bg-[#7a2843] transition-colors disabled:opacity-40"
              >
                {generating ? "Generating..." : "Generate Resume"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PDF preview */}
      {pdfUrl && (
        <>
          <div className="my-10 flex flex-col items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Your converted resume
            </p>
            <div className="flex flex-col items-center">
              <div className="h-8 w-px bg-gray-300" />
              <div className="h-0 w-0 border-l-4 border-r-4 border-t-[6px] border-l-transparent border-r-transparent border-t-gray-300" />
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full"
              style={{ height: "800px" }}
            />
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href={pdfUrl}
              download="rirekisho.pdf"
              className="rounded-lg bg-[#993556] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#7a2843] transition-colors"
            >
              Download PDF
            </a>
          </div>
        </>
      )}
    </main>
  );
}
