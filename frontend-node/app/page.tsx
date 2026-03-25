import Link from "next/link";

// app/page.tsx
export default function Home() {
  return (
    <main className="font-sans text-gray-900">
      <section className="max-w-4xl px-12 py-20">
        <p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
          your career, japan-ready
        </p>
        <h1 className="font-serif text-[clamp(3rem,7vw,6rem)] font-black leading-none tracking-tight">
          Your resume, <em className="italic text-[#993556]">reborn</em>
          <br />
          for Japan.
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-gray-500">
          Japanese hiring is different. The format, the tone, the expectations —
          all of it. Shift2Sakura converts and refines your resume so you walk
          in ready.
        </p>
        <div className="mt-10 flex items-center gap-6">
          <Link href="/resume-converter">
            <button className="cursor-pointer rounded bg-[#993556] px-7 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-[#e86d96] hover:text-gray-900">
              Convert my resume
            </button>
          </Link>
        </div>
      </section>

      <hr className="mx-12 border-gray-100" />

      <section className="grid grid-cols-2 items-center gap-16 px-12 py-20">
        {/* Replace this div with your <Image /> component */}
        <div className="flex aspect-[4/3] items-center justify-center rounded border border-gray-100 bg-gray-50 text-sm text-gray-300">
          your image here
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-xs font-medium uppercase tracking-widest text-[#993556]">
            How it works
          </span>
          <h2 className="font-serif text-4xl font-bold leading-snug">
            More than a translation.
          </h2>
          <p className="leading-relaxed text-gray-500">
            Japanese employers don't just read your resume — they read between
            the lines. We restructure your experience into the formats and
            conventions that Japanese hiring managers expect, from rirekisho
            style to keigo-appropriate phrasing.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Rirekisho format",
              "職務経歴書 ready",
              "Tone refinement",
              "ATS optimized",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
