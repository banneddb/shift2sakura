"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

type Resume = {
  id: string;
  userId: string;
  createdAt: string;
  result: string;
};

export default function MyResumes() {
  const { getToken } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Resume | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch resumes
  useEffect(() => {
    async function fetchResumes() {
      try {
        const token = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/myResumes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch resumes");

        const data = await res.json();
        setResumes(data);

        if (data.length > 0) setSelected(data[0]);
      } catch {
        setError("Failed to load resumes.");
      } finally {
        setLoading(false);
      }
    }

    fetchResumes();
  }, [getToken]);

  // Cleanup blob URLs (prevent memory leak)
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  async function handleRegenerate(resume: Resume) {
    setGenerating(true);
    setPdfUrl(null);
    setError(null);

    try {
      const token = await getToken();

      // Safely parse result
      let parsed;
      try {
        parsed = JSON.parse(resume.result);
      } catch {
        throw new Error("Invalid resume data format");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generateResume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(parsed),
        },
      );

      if (!res.ok) throw new Error("Failed to generate PDF.");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch {
      setError("Failed to generate PDF.");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <main className="px-12 py-16 text-sm text-gray-400">
        Loading your resumes...
      </main>
    );
  }

  return (
    <main className="px-12 py-16">
      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
        my resumes
      </p>

      <h1 className="mb-3 font-serif text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-tight">
        Your past <em className="italic text-[#e8759a]">conversions.</em>
      </h1>

      <p className="mb-8 text-sm text-gray-400">
        Click a resume to preview and re-download it.
      </p>

      {resumes.length === 0 ? (
        <p className="text-sm text-gray-400">
          You haven't converted any resumes yet.
        </p>
      ) : (
        <div
          className="grid overflow-hidden rounded-2xl border border-gray-200"
          style={{ gridTemplateColumns: "380px 1fr", height: "600px" }}
        >
          {/* Left — list */}
          <div className="overflow-y-auto border-r border-gray-100">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => {
                  setSelected(resume);
                  setPdfUrl(null);
                }}
                className={`cursor-pointer border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 ${
                  selected?.id === resume.id
                    ? "border-l-2 border-l-[#993556] bg-pink-50"
                    : ""
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">
                  Resume #{resume.id.slice(-6)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(resume.createdAt).toLocaleDateString("en-US")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(resume.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>

          {/* Right — detail */}
          <div className="overflow-y-auto p-8 flex flex-col gap-6">
            {selected && (
              <>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                    Resume ID
                  </p>
                  <p className="text-sm text-gray-500 font-mono">
                    {selected.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                    Created
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(selected.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Safe parsed fields */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">
                    Converted fields
                  </p>

                  {(() => {
                    let parsed: Record<string, any> = {};
                    try {
                      parsed = JSON.parse(selected.result);
                    } catch {}

                    return (
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(parsed)
                          .filter(
                            (k) =>
                              ![
                                "学歴",
                                "職歴",
                                "免許・資格",
                                "職務経歴書",
                              ].includes(k),
                          )
                          .map((key) => (
                            <span
                              key={key}
                              className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500"
                            >
                              {key}
                            </span>
                          ))}
                      </div>
                    );
                  })()}
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  onClick={() => handleRegenerate(selected)}
                  disabled={generating}
                  className="rounded-lg bg-[#993556] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#7a2843] transition-colors disabled:opacity-40 w-fit"
                >
                  {generating ? "Generating..." : "Download PDF"}
                </button>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download="rirekisho.pdf"
                    className="text-sm text-[#993556] underline"
                  >
                    Click here if download didn't start
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
