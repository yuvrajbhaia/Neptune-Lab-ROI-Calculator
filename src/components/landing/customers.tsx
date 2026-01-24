"use client";

import { motion } from "framer-motion";

const customers = [
  "Owens Corning",
  "Swastick Plastoalloyes",
  "Sonali",
  "Alok Masterbatch",
  "Tapidor",
  "Blend Colours",
  "JJ Plastalloy",
];

export function Customers() {
  return (
    <section className="py-16 border-t border-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#6B7280] uppercase tracking-wider mb-8"
        >
          Trusted by Industry Leaders
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {customers.map((customer, index) => (
            <motion.div
              key={customer}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="px-6 py-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:border-[#E07A5F]/30 transition-colors"
            >
              <span className="text-sm md:text-base font-medium text-[#4B5563]">
                {customer}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-xs text-[#9CA3AF] mt-8"
        >
          Channel partners to Weber Germany, Count Thing USA, Zolnoi Singapore
        </motion.p>
      </div>
    </section>
  );
}
