"use client";
import { useState, useEffect } from "react";

type Job = {
  id: number;
  company: string;
  role: string;
  location: string;
  type: string;
  description: string;
};

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setSelected(data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <main className="px-12 py-16 text-xl text-gray-400">
        Loading listings...
      </main>
    );
  if (!selected)
    return (
      <main className="px-12 py-16 text-xl text-gray-400">
        No listings found.
      </main>
    );

  return (
    <main className="px-12 py-16">
      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
        listing finder
      </p>
      <h1 className="mb-3 font-serif text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-tight">
        Let us find you <em className="italic text-[#993556]">jobs for you.</em>
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        Based on your resume, here are some great options
      </p>

      <div
        className="grid overflow-hidden rounded-2xl border border-gray-200"
        style={{ gridTemplateColumns: "380px 1fr", height: "600px" }}
      >
        {/* Left — scrollable list */}
        <div className="overflow-y-auto border-r border-gray-100">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelected(job)}
              className={`cursor-pointer border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 ${
                selected.id === job.id
                  ? "border-l-2 border-l-[#993556] bg-pink-50"
                  : ""
              }`}
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-400">
                  {initials(job.company)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {job.role}
                  </p>
                  <p className="text-sm text-gray-400">{job.company}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-400">
                  {job.location}
                </span>
                <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-400">
                  {job.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right — detail panel */}
        <div className="overflow-y-auto p-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-400">
            {initials(selected.company)}
          </div>
          <h2 className="font-serif text-3xl font-bold">{selected.role}</h2>
          <p className="mb-5 mt-1 text-base text-gray-400">
            {selected.company}
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-400">
              {selected.location}
            </span>
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-400">
              {selected.type}
            </span>
          </div>
          <button className="mb-8 rounded-lg bg-[#993556] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#7a2843] transition-colors">
            Apply now
          </button>
          <hr className="mb-6 border-gray-100" />
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            About this role
          </p>
          <p className="text-sm leading-relaxed text-gray-500">
            {selected.description}
          </p>
        </div>
      </div>
    </main>
  );
}
