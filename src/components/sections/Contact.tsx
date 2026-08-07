export function Contact() {
  return (
    <section
      id="contact"
      className="relative z-10 min-h-screen overflow-hidden border-t border-white/10 px-5 py-28 md:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 h-[70vh] w-[45vw] rounded-tl-full bg-[radial-gradient(circle_at_center,rgba(122,25,25,0.22),transparent_65%)]" />
        <div className="absolute bottom-10 right-10 hidden h-[520px] w-[340px] rounded-[3rem] border border-white/10 bg-white/[0.035] blur-[1px] md:block" />
      </div>

      <div className="mx-auto flex min-h-[70vh] max-w-[1500px] flex-col justify-between">
        <div>
          <p className="mb-8 text-[10px] uppercase tracking-[0.46em] text-white/38">
            Contact
          </p>

          <h2 className="font-display max-w-[1250px] text-[clamp(4rem,13vw,14rem)] font-semibold uppercase leading-[0.72] tracking-[-0.11em]">
            Let&apos;s build something meaningful.
          </h2>
        </div>

        <div className="mt-16 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.3em] text-white/70">
          <a
            className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:bg-white/10"
            href="#"
          >
            GitHub
          </a>
          <a
            className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:bg-white/10"
            href="#"
          >
            LinkedIn
          </a>
          <a
            className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:bg-white/10"
            href="#"
          >
            Instagram
          </a>
          <a
            className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:bg-white/10"
            href="#"
          >
            Resume
          </a>
          <a
            className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:bg-white/10"
            href="mailto:your-email@example.com"
          >
            Email
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[-4vw] left-1/2 -z-10 -translate-x-1/2 font-display text-[22vw] font-semibold uppercase leading-none tracking-[-0.14em] text-white/[0.025]">
        VIRAJ
      </div>
    </section>
  );
}