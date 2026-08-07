import { projects } from "@/data/site";

export function CaseFiles() {
  return (
    <section
      id="case-files"
      className="relative z-10 border-t border-white/10 px-5 py-28 md:px-8 md:py-40"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-16 grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <p className="text-[10px] uppercase tracking-[0.46em] text-white/38">
            Case Files
          </p>

          <h2 className="font-display text-[clamp(3.2rem,8vw,8.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.09em]">
            Every build becomes a documented system.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.number}
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 transition duration-500 hover:border-white/20 hover:bg-white/[0.06] md:p-8"
            >
              <div className="mb-12 flex items-center justify-between text-[10px] uppercase tracking-[0.34em] text-white/35">
                <span>Case {project.number}</span>
                <span>Open File</span>
              </div>

              <h3 className="font-display text-5xl font-semibold uppercase leading-[0.82] tracking-[-0.08em] md:text-6xl">
                {project.title}
              </h3>

              <p className="mt-6 text-base leading-relaxed text-white/55">
                {project.description}
              </p>

              <div className="mt-8 grid gap-3 text-[10px] uppercase tracking-[0.28em] text-white/38">
                <p>Problem</p>
                <p>Architecture</p>
                <p>Challenges</p>
                <p>What I Learned</p>
                <p>Interview Questions</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}