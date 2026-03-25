// app/job-listings/page.tsx
"use client";
import { useState } from "react";

// Later, replace this with real data fetched from your database
const jobs = [
  {
    id: 1,
    company: "Rakuten",
    role: "Frontend Engineer",
    location: "Tokyo, Japan",
    salary: "¥7M–¥10M",
    type: "Full-time",
    description:
      "Join Rakuten's global engineering team building world-class e-commerce experiences. You'll work on large-scale React applications serving millions of users across Japan and internationally.",
  },
  {
    id: 2,
    company: "Mercari",
    role: "Software Engineer",
    location: "Tokyo, Japan",
    salary: "¥6M–¥9M",
    type: "Full-time",
    description:
      "Mercari is Japan's largest C2C marketplace. We're looking for engineers who thrive in a fast-paced, product-driven environment with a strong remote-friendly culture.",
  },
  {
    id: 3,
    company: "SmartHR",
    role: "Full Stack Developer",
    location: "Tokyo (Hybrid)",
    salary: "¥5M–¥8M",
    type: "Hybrid",
    description:
      "SmartHR is modernising HR software across Japan. This role involves building features across our React frontend and Ruby on Rails backend, with a focus on UX quality.",
  },
  {
    id: 4,
    company: "Moneyforward",
    role: "Backend Engineer",
    location: "Osaka, Japan",
    salary: "¥6M–¥8M",
    type: "Full-time",
    description:
      "Work on Japan's leading personal finance platform. You'll own backend services handling millions of financial transactions with a focus on reliability and scale.",
  },
  {
    id: 5,
    company: "Wantedly",
    role: "Product Engineer",
    location: "Tokyo, Japan",
    salary: "¥5M–¥7M",
    type: "Contract",
    description:
      "Wantedly connects people with companies they love. As a product engineer, you'll work closely with designers and PMs to ship features that improve how people discover careers in Japan.",
  },
];

// Gets the initials from a company name for the logo placeholder
function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

type Job = (typeof jobs)[0];

export default function JobListings() {
  const [selected, setSelected] = useState<Job>(jobs[0]);

  return (
    <main className="px-12 py-16">
      {/* ── Heading ── */}
      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
        listing finder
      </p>
      <h1 className="mb-3 font-serif text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-tight">
        Let us find you <em className="italic text-[#993556]">jobs for you.</em>
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        Based on your resume, here are some great options
      </p>

      {/* ── Panel ── */}
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
                {/* Logo placeholder */}
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
                <span className="rounded-full border border-pink-200 bg-pink-50 px-2.5 py-0.5 text-xs text-[#993556]">
                  {job.salary}
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
            <span className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs text-[#993556]">
              {selected.salary}
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
