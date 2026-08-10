import { EraseText } from "@/components/ui/EraseText";

export function ReactiveHeadline() {
  return (
    <h1 className="font-display relative max-w-[820px] cursor-default select-none text-[clamp(3.7rem,7.7vw,8.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.095em]">
      <EraseText
        lines={["I build", "systems that", "see, think", "and interact."]}
      />
    </h1>
  );
}