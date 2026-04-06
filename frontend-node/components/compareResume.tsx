"use client";

import { Compare } from "@/components/ui/compare";

export function ResumeCompare() {
  return (
    <section className="flex flex-col items-center gap-6 px-12 py-20">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
        <span className="text-[#e8759a]">Before & After</span>
      </p>
      <h2 className="font-serif text-4xl font-bold">See the <span className="text-[#e8759a]">difference.</span></h2>

      <div className="rounded-3xl border border-neutral-200 bg-neutral-100 p-4">
        <Compare
          firstImage="/behruz_resume.png"
          secondImage="/japanese_resume.png"
          firstImageClassName="object-cover object-left-top"
          secondImageClassname="object-cover object-left-top"
          className="h-[400px] w-[340px] md:h-[600px] md:w-[500px]"
          slideMode="drag"
          autoplay={true}
          autoplayDuration={2000}
          initialSliderPercentage={10}
        />
      </div>

      <p className="text-sm italic text-gray-400">Drag to compare — or just watch.</p>
    </section>
  );
}