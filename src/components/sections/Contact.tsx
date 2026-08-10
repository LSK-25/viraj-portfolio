import { socialLinks } from "@/data/site";
import { ScrambleText } from "@/components/ui/ScrambleText";
import Image from "next/image";
import { EraseText } from "@/components/ui/EraseText";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative z-10 min-h-screen overflow-hidden border-t border-white/10 px-5 pb-10 pt-36 md:px-8"
    >
      <div className="mx-auto grid min-h-[76vh] max-w-[1500px] gap-12 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="flex flex-col justify-start">
          <p className="mb-8 text-[10px] uppercase tracking-[0.46em] text-white/38">
            <ScrambleText text="CONTACT" />
          </p>

          <h2 className="font-display max-w-[1100px] cursor-default select-none text-[clamp(4.4rem,11.5vw,13rem)] font-semibold uppercase leading-[0.72] tracking-[-0.11em]">
  <EraseText lines={["Let's build", "something", "meaningful"]} />
</h2>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute left-0 top-0 h-[62vh] max-h-[620px] min-h-[500px] w-full rounded-[3rem] border border-white/10 bg-white/[0.035] shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_45%_30%,rgba(255,255,255,0.10),transparent_36%),radial-gradient(circle_at_80%_75%,rgba(122,25,25,0.22),transparent_45%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-8">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.36em] text-white/38">
                <span><ScrambleText text="Transmission" /></span>
                <span><ScrambleText text="VP-01" /></span>
              </div>

              <div className="relative h-[260px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
                <Image
                  src="/images/leon-contact.jpg"
                  alt="Leon Kennedy inspired visual reference"
                  fill
                  className="object-cover opacity-70 grayscale"
                  priority={false}
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.72)),radial-gradient(circle_at_50%_30%,transparent,rgba(0,0,0,0.65))]" />

                <div className="absolute left-5 top-5 text-[9px] uppercase tracking-[0.34em] text-white/42">
                  Visual File
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <p className="text-[10px] uppercase leading-relaxed tracking-[0.3em] text-white/58">
                    Case 1998
                    <br />
                    Reference Mood
                  </p>

                  <div className="grid h-9 w-9 grid-cols-3 gap-1 opacity-45">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span key={index} className="bg-white/70" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45">
  <a
    href="https://github.com/LSK-25"
    target="_blank"
    rel="noreferrer"
    className="transition hover:text-white"
  >
    <ScrambleText text="GitHub" />
  </a>

  <a
    href="https://www.linkedin.com/in/viraj-patil-2524vp04"
    target="_blank"
    rel="noreferrer"
    className="transition hover:text-white"
  >
    <ScrambleText text="LinkedIn" />
  </a>

  <a
    href="https://www.instagram.com/_viraj2504"
    target="_blank"
    rel="noreferrer"
    className="transition hover:text-white"
  >
    <ScrambleText text="Instagram" />
  </a>

 <a
  href="/Viraj_Patil_Resume.pdf"
  target="_blank"
  rel="noreferrer"
  className="transition hover:text-white"
>
  <ScrambleText text="Resume" />
</a>

  <a
    href="mailto:vir252004@gmail.com"
    className="transition hover:text-white"
  >
    <ScrambleText text="Email" />
  </a>
</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.3em] text-white/70 lg:hidden">
  <a
    className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:text-white"
    href="https://github.com/LSK-25"
    target="_blank"
    rel="noreferrer"
  >
    GitHub
  </a>

  <a
    className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:text-white"
    href="https://www.linkedin.com/in/viraj-patil-2524vp04"
    target="_blank"
    rel="noreferrer"
  >
    LinkedIn
  </a>

  <a
    className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:text-white"
    href="https://www.instagram.com/_viraj2504"
    target="_blank"
    rel="noreferrer"
  >
    Instagram
  </a>

  <a
  className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:text-white"
  href="/Viraj_Patil_Resume.pdf"
  target="_blank"
  rel="noreferrer"
>
  Resume
</a>

  <a
    className="rounded-full border border-white/15 px-5 py-3 transition hover:border-white/35 hover:text-white"
    href="mailto:vir252004@gmail.com"
  >
    Email
  </a>
</div>
      </div>
    </section>
  );
}