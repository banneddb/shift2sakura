export default function Team() {
  return (
    <main className="px-12 py-16">
      {/* ── Heading ── */}
      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
        the ones behind Shift2Sakura.
      </p>
      <h1 className="mb-10 font-serif text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-tight">
        <em className="italic text-[#993556]">Hamza</em> and{" "}
        <em className="italic text-[#993556]">Behruz</em>
      </h1>
      <div className="mx-auto w-156 flex aspect-[4/3] items-center justify-center rounded border border-gray-400 bg-gray-50 text-sm text-gray-300">
        your image here
      </div>
    </main>
  );
}
