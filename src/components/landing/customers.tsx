"use client";

import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const logos = [
  { src: "/logos/owens-corning.jpg", alt: "Owens Corning" },
  { src: "/logos/swastick.png", alt: "Swastick Plastoalloyes" },
  { src: "/logos/sonali.jpeg", alt: "Sonali Polyplast" },
  { src: "/logos/alok.jpeg", alt: "Alok Masterbatch" },
  { src: "/logos/tapidor.png", alt: "Tapidor" },
  { src: "/logos/blend-colours.png", alt: "Blend Colours" },
  { src: "/logos/jj-plastalloy.png", alt: "JJ Plastalloy" },
  { src: "/logos/bhavin.png", alt: "Bhavin Industries" },
  { src: "/logos/scj.png", alt: "SCJ" },
];

export function Customers() {
  return (
    <section className="py-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm text-gray-400 uppercase tracking-widest mb-10">
          Trusted by industry leaders
        </p>

        <InfiniteSlider gap={60} duration={35} className="py-4">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center px-4"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={50}
                className="h-[50px] w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
