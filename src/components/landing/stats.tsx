"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "57", suffix: "+", label: "Years of Experience" },
  { value: "2,457", suffix: "+", label: "Machines Installed" },
  { value: "3,000", suffix: "+", label: "Happy Customers Worldwide" },
  { value: "30M", suffix: "+", label: "Tons Processed" },
];

export function Stats() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center py-4 sm:py-0"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                {stat.value}
                <span className="text-[#E07A5F]">{stat.suffix}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
