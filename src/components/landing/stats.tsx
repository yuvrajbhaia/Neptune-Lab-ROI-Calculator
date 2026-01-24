"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "57+", label: "Years of Experience", suffix: "" },
  { value: "2,457", label: "Machines Installed", suffix: "+" },
  { value: "3,000", label: "Happy Customers", suffix: "+" },
  { value: "30M", label: "Tons Processed", suffix: "+" },
];

export function Stats() {
  return (
    <section className="py-16 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2">
                {stat.value}
                <span className="text-[#E07A5F]">{stat.suffix}</span>
              </div>
              <div className="text-sm md:text-base text-[#6B7280]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
