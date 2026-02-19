import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function TypewriterEffectSmoothDemo() {
  const words = [
    { text: "Turning" },
    { text: "ideas" },
    { text: "into" },
    { text: "real" },
    {
      text: "products.",
      className: "text-brand",
    },
  ];

  return (
    <div className="mx-auto w-full">
      <div className="card card-hover p-6 md:p-8 text-center">
        <TypewriterEffectSmooth words={words} className="justify-center" />
      </div>
    </div>
  );
}
