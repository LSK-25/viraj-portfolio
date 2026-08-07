import { personalSignals } from "@/data/site";

export function About() {
  return (
    <section
      id="about"
      className="relative z-10 min-h-screen border-t border-white/10 px-5 py-28 md:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute right-0 top-16 -z-10 font-display text-[18vw] font-semibold uppercase leading-none tracking-[-0.12em] text-white/[0.025]">
        About
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-14 md:grid-cols-[0.75fr_1.25fr]">
        <p className="text-[10px] uppercase tracking-[0.46em] text-white/38">
          About
        </p>

        <div>
          <h2 className="font-display text-[clamp(3.2rem,8vw,8.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.09em]">
            Building the skill to create useful systems.
          </h2>

          <div className="mt-10 grid gap-7 text-lg leading-relaxed text-white/58 md:grid-cols-2 md:text-xl">
            <p>
              I’m Viraj Patil, a B.Tech Electronics & Telecommunication student
              moving deeply into AI, cybersecurity, computer vision, and
              full-stack engineering.
            </p>

            <p>
              I learn by building real products, breaking them, fixing them,
              documenting every decision, and turning each project into
              something I can confidently explain.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {personalSignals.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/48"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}