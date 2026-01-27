"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "57", label: "Years in Business" },
  { value: "2,457", label: "Machines Installed" },
  { value: "3,000+", label: "Customers Worldwide" },
];

export function Stats() {
  return (
    <section className="py-20 px-6 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-semibold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
