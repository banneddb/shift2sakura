"use client";
import { useState } from "react";

type Result = {
  score_number: number;
  score_quantitative: string;
  advice: string[];
};

export default function ResumeConverter() {
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = result
    ? circumference - (result.score_number / 100) * circumference
    : circumference;

  async function handleConvert() {
    if (!file || !role) return;

    // Package up the file and role into FormData to send to the backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/convert`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Something went wrong.");

      const data: Result = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to convert resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-12 py-16">

      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
        resume converter
      </p>
      <h1 className="mb-12 font-serif text-[clamp(2.2rem,5vw,4rem)] font-black leading-tight tracking-tight">
        Turn your resume into{" "}
        <em className="italic text-[#993556]">something they'll read.</em>
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
            <svg className="w-9 h-9 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
            </svg>
            <span className="text-sm text-gray-400 leading-relaxed">
              {file ? (
                <span className="text-[#993556] font-medium">{file.name}</span>
              ) : (
                <><span className="text-[#993556] font-medium">Click to upload</span> or drag & drop<br />PDF or DOCX</>
              )}
            </span>
          </label>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">Target role</label>
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
            {loading ? "Converting..." : "Convert !"}
          </button>
        </div>

        {/* Right — output */}
        <div className="flex flex-col gap-6 bg-gray-50 p-8">
          {!result ? (
            <p className="text-sm text-gray-300 m-auto">Your results will appear here.</p>
          ) : (
            <>
              {/* Score ring */}
              <div className="flex items-center gap-5">
                <svg width="80" height="80" viewBox="0 0 80 80" className="flex-shrink-0">
                  <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r={radius} fill="none"
                    stroke="#993556" strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  />
                  <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="600" fill="currentColor">
                    {result.score_number}
                  </text>
                </svg>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Resume score</span>
                  <span className="font-serif text-xl font-bold">{result.score_quantitative}</span>
                  <span className="text-xs text-gray-400">Needs refinement for JP market</span>
                </div>
              </div>

              {/* Advice list */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Key improvements</p>
                <div className="flex flex-col gap-2.5">
                  {result.advice.map((item, i) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-gray-100 bg-white p-3">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#993556]" />
                      <p className="text-sm leading-relaxed text-gray-500">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Arrow + resume preview — only show after conversion */}
      {result && (
        <>
          <div className="my-10 flex flex-col items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">View converted resume</p>
            <div className="flex flex-col items-center">
              <div className="h-8 w-px bg-gray-300" />
              <div className="h-0 w-0 border-l-4 border-r-4 border-t-[6px] border-l-transparent border-r-transparent border-t-gray-300" />
            </div>
          </div>
          <div className="min-h-[200px] rounded-2xl border border-gray-100 bg-white p-8 flex items-center justify-center">
            <p className="text-sm text-gray-300">LaTeX-rendered resume will appear here</p>
          </div>
        </>
      )}

    </main>
  );
}
