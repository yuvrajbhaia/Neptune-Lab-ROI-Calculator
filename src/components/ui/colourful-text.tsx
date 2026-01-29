"use client";

import React from "react";
import { motion } from "framer-motion";

export function ColourfulText({ text }: { text: string }) {
  // Vibrant rainbow colors with high saturation
  const colors = [
    "#FF0000", // Vibrant Red
    "#FF7F00", // Vibrant Orange
    "#FFFF00", // Vibrant Yellow
    "#00FF00", // Vibrant Green
    "#00FFFF", // Vibrant Cyan
    "#0000FF", // Vibrant Blue
    "#8B00FF", // Vibrant Violet/Purple
    "#FF00FF", // Vibrant Magenta
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${count}-${index}`}
          initial={{ y: 0 }}
          animate={{
            color: currentColors[index % currentColors.length],
            y: [0, -3, 0],
            scale: [1, 1.05, 1],
            filter: ["blur(0px)", "blur(3px)", "blur(0px)"],
            opacity: [1, 0.9, 1],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
          }}
          className="inline-block whitespace-pre font-sans tracking-tight"
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}
