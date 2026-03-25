// app/resume-converter/page.tsx
"use client";
import { useState } from "react";

const adviceItems = [
  {
    title: "Self-PR section missing",
    body: "Japanese employers expect a brief 自己PR summarising your value.",
  },
  {
    title: "Bullet tone is too direct",
    body: "Rephrase achievements in a collaborative framing.",
  },
  {
    title: "Dates need reformatting",
    body: "Use Japanese era format (令和/平成) alongside western dates.",
  },
];

export default function ResumeConverter() {
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const score = 72;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <main className="px-12 py-16">
      {/* ── Heading ── */}
      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
        resume converter
      </p>
      <h1 className="mb-12 font-serif text-[clamp(2.2rem,5vw,4rem)] font-black leading-tight tracking-tight">
        Turn your resume into{" "}
        <em className="italic text-[#993556]">something they'll read.</em>
      </h1>

      {/* ── Main panel ── */}
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200">
        {/* Left — inputs */}
        <div className="flex flex-col gap-5 p-8 border-r border-gray-100">
          {/* File upload */}
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

          {/* Role input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Target role
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer, Tokyo"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#993556] transition-colors"
            />
          </div>

          <button className="mt-auto rounded-lg bg-[#993556] py-3 text-sm font-medium tracking-wide text-white hover:bg-[#7a2843] transition-colors">
            Convert !
          </button>
        </div>

        {/* Right — output */}
        <div className="flex flex-col gap-6 bg-gray-50 p-8">
          {/* Score ring */}
          <div className="flex items-center gap-5">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="flex-shrink-0"
            >
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="#993556"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
              <text
                x="40"
                y="45"
                textAnchor="middle"
                fontSize="16"
                fontWeight="600"
                fill="currentColor"
                className="text-gray-900"
              >
                {score}
              </text>
            </svg>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Resume score
              </span>
              <span className="font-serif text-xl font-bold">
                Good foundation
              </span>
              <span className="text-xs text-gray-400">
                Needs refinement for JP market
              </span>
            </div>
          </div>

          {/* Advice list */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Key improvements
            </p>
            <div className="flex flex-col gap-2.5">
              {adviceItems.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-lg border border-gray-100 bg-white p-3"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#993556]" />
                  <p className="text-sm leading-relaxed text-gray-500">
                    <strong className="font-medium text-gray-800">
                      {item.title}
                    </strong>{" "}
                    — {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Arrow ── */}
      <div className="my-10 flex flex-col items-center gap-2">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
          View converted resume
        </p>
        <div className="flex flex-col items-center">
          <div className="h-8 w-px bg-gray-300" />
          <div className="h-0 w-0 border-l-4 border-r-4 border-t-[6px] border-l-transparent border-r-transparent border-t-gray-300" />
        </div>
      </div>

      {/* ── Resume preview ── */}
      <div className="min-h-[200px] rounded-2xl border border-gray-100 bg-white p-8 flex items-center justify-center">
        <p className="text-sm text-gray-300">
          LaTeX-rendered resume will appear here
        </p>
      </div>
    </main>
  );
}
