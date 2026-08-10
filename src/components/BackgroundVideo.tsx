export function BackgroundVideo() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <video
        className="h-full w-full object-cover opacity-30"
        src="/videos/background.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(120,20,35,0.22),transparent_42%),radial-gradient(circle_at_70%_70%,rgba(90,50,170,0.14),transparent_38%)]" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
}