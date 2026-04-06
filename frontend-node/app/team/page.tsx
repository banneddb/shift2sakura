import Image from "next/image";

export default function Team() {
  return (
    <main className="px-12 py-16">
      {/* Heading */}
      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-400 before:inline-block before:h-px before:w-7 before:bg-gray-400 before:content-['']">
        the ones behind Shift 2 Sakura.
      </p>
      <h1 className="mb-16 font-serif text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-tight">
        <em className="text">Meet the Team</em>
      </h1>

      {/* Team grid */}
      <div className="grid grid-cols-2 gap-16">

        {/* Hamza */}
        <div className="flex flex-col gap-5">
          <h2 className="font-serif text-4xl font-black">Hamza</h2>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded border border-gray-100">
            <Image
              src="/hamza.png"
              alt="Hamza"
              fill
              className="object-cover object-top"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">About Hamza</h3>
            <p className="mt-2 leading-relaxed text-gray-500">
              Hamza is currently a junior at Skidmore University majoring in Computer Science. Originally from Jordan and Palestine, he came to the United States and since then has contributed to the fields of Artificial Intelligence, with cool projects focusing on robot dogs and their interaction with humans and the environment. As a student working and studying in a foreign country himself, his passion stems directly from his own personal experiences.
            </p>
          </div>
        </div>

        {/* Behruz */}
        <div className="flex flex-col gap-5">
          <h2 className="font-serif text-4xl font-black">Behruz</h2>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded border border-gray-100">
            <Image
              src="/behruz.png"
              alt="Behruz"
              fill
              className="object-cover object-top"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">About Behruz</h3>
            <p className="mt-2 leading-relaxed text-gray-500">
              Incoming Software Engineer Intern at Certara, Behruz is currently a junior at the Temple University Honors College majoring in Computer Science and Statistics. He currently conducts research in the HCI Lab at Temple University, focusing on how AI influences the habits of students and graduates. His passion for building this project was simple: make moving to Japan easier and faster for those not 100% proficient in reading katakana and hiragana characters.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}