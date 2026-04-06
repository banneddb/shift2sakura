import Link from "next/link";
import { ResumeCompare } from "@/components/compareResume";

// app/page.tsx
export default function Home() {
  return (
    <main className="font-sans text-gray-900">

      {/* Hero */}
      <section className="max-w-4xl px-12 py-20">
        <p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
          your career, japan-ready
        </p>
        <h1 className="font-serif text-[clamp(3rem,7vw,6rem)] font-black leading-none tracking-tight">
          Your resume, <span className="italic text-[#e8759a]">reborn</span>
          <br />
          for Japan.
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-gray-500">
          Japanese hiring is different. The format, the tone, the expectations —
          all of it. <span className="text-[#e8759a]">Shift 2 Sakura</span> converts and refines your resume so you walk
          in ready.
        </p>
        <div className="mt-10 flex items-center gap-6">
          <Link href="/resume-converter">
            <button className="cursor-pointer rounded bg-[#e8759a] px-7 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-[#d45f86] transition-colors">
              Convert my resume
            </button>
          </Link>
        </div>
      </section>

      <hr className="mx-12 border-gray-100" />

      {/* Compare + How it works */}
      <section className="grid grid-cols-2 items-center gap-16 px-12 py-20">

        {/* Left — compare slider */}
        <ResumeCompare />

        {/* Right — how it works */}
        <div className="flex flex-col gap-8">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-[#e8759a]">
              How it works
            </span>
            <h2 className="mt-2 font-serif text-4xl font-bold leading-snug">
              More than a translation.
            </h2>
            <p className="mt-4 leading-relaxed text-gray-500">
              Japanese employers don't just read your resume — they read between
              the lines. We restructure your experience into the formats and
              conventions that Japanese hiring managers expect, from rirekisho
              style to keigo-appropriate phrasing.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-30">
            {[
              { n: "1", title: "Upload your resume", desc: "Drop in your existing PDF resume." },
              { n: "2", title: "Paste the job description", desc: "Add the job posting you're applying to and get tailored advice on missing questions." },
              { n: "3", title: "Watch the magic happen", desc: "We convert, translate, and format everything into a ready-to-submit rirekisho." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-6">
                <span className="font-serif text-7xl font-black leading-none text-[#e8759a] opacity-30">
                  {n}
                </span>
                <div className="pt-1">
                  <p className="text-3xl font-semibold text-gray-900">{title}</p>
                  <p className="mt-1 text-base leading-relaxed text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
          </div>
        </div>

      </section>
    </main>
  );
}