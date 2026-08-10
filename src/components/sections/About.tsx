import { personalSignals } from "@/data/site";
import { EraseText } from "@/components/ui/EraseText";
import { ScrambleText } from "@/components/ui/ScrambleText";

export function About() {
  return (
    <section
      id="about"
      className="relative z-10 overflow-hidden px-5 py-28 md:px-8"
    >
      <div className="mx-auto grid max-w-[1500px] gap-14 md:grid-cols-[0.75fr_1.25fr]">
        <p className="text-[10px] uppercase tracking-[0.46em] text-white/38">
          <ScrambleText text="About" />
        </p>

        <div>
          <h2 className="font-display text-[clamp(4rem,8vw,9rem)] font-semibold uppercase leading-[0.76] tracking-[-0.1em]">
            <EraseText lines={["Built by", "breaking", "things"]} />
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <p className="font-display max-w-[520px] text-[clamp(1.35rem,1.9vw,2.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.065em] text-white/62">
              B.Tech ExTC student building across AI, cybersecurity, computer
              vision, and full-stack systems.
            </p>

            <p className="font-display max-w-[520px] text-[clamp(1.35rem,1.9vw,2.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.065em] text-white/62">
              I learn by building, breaking, fixing, and documenting real
              projects.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {personalSignals.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/48"
              >
                <ScrambleText text={item} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}