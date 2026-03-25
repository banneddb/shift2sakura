// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-black bg-orange-50 px-8">
      {" "}
      <Link
        href="/"
        className="text-[25px] font-semibold tracking-tight text-gray-900"
      >
        Shift<em className="italic text-[#993556]">2</em>Sakura
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/"
          className="rounded-lg px-4 py-1.5 text-lg font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/resume-converter"
          className="rounded-lg px-4 py-1.5 text-lg font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Resume Converter
        </Link>
        <Link
          href="/job-listings"
          className="rounded-lg px-4 py-1.5 text-lg font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Job Listings
        </Link>
        <Link
          href="/team"
          className="rounded-lg px-4 py-1.5 text-lg font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Team
        </Link>
      </div>
    </nav>
  );
}
