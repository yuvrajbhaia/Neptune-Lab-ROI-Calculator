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
    <section className="py-20 border-t border-gray-100">
      <div className="w-full">
        <p className="text-center text-sm text-gray-400 uppercase tracking-widest mb-12">
          Trusted by industry leaders
        </p>

        <InfiniteSlider gap={100} duration={45} className="py-8">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center px-8"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={100}
                className="h-[100px] w-auto object-contain"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
