"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  painId: number;
  title: string;
}

// Detailed explanations for each pain point
const painExplanations: Record<number, { scenario: string; problem: string; solution: string; example?: string }> = {
  1: {
    scenario: "Picture this: Your masterbatch colour looks exactly what the customer wanted. Sample approved. You run the full production batch. You ship the order. Two weeks later, your phone rings.",
    problem: "\"The color faded after stretching. We're rejecting the entire batch.\" This happens because lab samples don't go through the same stretching process as production. The color you see in your lab is NOT the color your customer gets.",
    solution: "The 25mm Lab Raffia Tape Line stretches the tape exactly like your production line (5.5 to 7.0 stretch ratios). You test with just 4.5-6 kg of material instead of 1,000+ kg on production. The color you see is the color your customer gets.",
    example: "If you have 1 rejected trial per month at 200 kg/hr for 3 hours, that's 600 kg wasted × ₹110 (material + processing) = ₹66,000/month loss."
  },
  2: {
    scenario: "A company is launching a new pigment in the market which is ₹10 lower in price. You want to try it out, but you have full regular orders running.",
    problem: "You say to your team: \"Ignore for the moment, we can't spare the machine for trials.\" You miss out on cost savings because you can't afford to stop production for R&D.",
    solution: "With the lab machine, you can test new pigments anytime without stopping production. Even a tiny ₹1/kg saving on a 200 kg/hr machine running 22 hrs/day, 25 days/month = ₹1,10,000/month in savings!",
    example: "One successful pigment trial can pay for itself many times over. If you find a pigment that's just ₹1 cheaper, that's ₹13,20,000/year in savings."
  },
  3: {
    scenario: "A customer comes with a new product and wants you to develop the masterbatch for them. They need 5-10 kg for a trial run.",
    problem: "How do you create just 5-10 kg when your production line minimum is 1,000+ kg? You either refuse the customer or waste massive amounts on a small trial.",
    solution: "The lab line produces exactly the small quantities needed for customer trials. You can serve any customer request without production disruption.",
    example: "Assuming 3 such cases a year, each causing ₹25,000 in production loss and wastage = ₹75,000/year."
  },
  4: {
    scenario: "A new lab in-charge has joined. They want to experiment with new recipes - changing chemicals or additives that could improve functionality or reduce costs.",
    problem: "Every experiment means stopping commercial production. Innovation gets killed because the cost of experimentation is too high.",
    solution: "The lab machine becomes your dedicated R&D tool. Your team can experiment freely, try new formulations, and innovate without touching production.",
    example: "Assuming 3 such experiments a year, each causing ₹25,000 in production loss = ₹75,000/year."
  },
  5: {
    scenario: "A big competitor has dropped prices by ₹3/kg by using 20% good recycled material instead of 100% virgin. You've never used recycled material.",
    problem: "You want to experiment with 10-15% recycled material to stay competitive, but you can't risk production quality on untested formulations.",
    solution: "Test recycled material blends safely on the lab line. Find the perfect mix that maintains quality while reducing costs. Even ₹1/kg savings across multiple machines adds up fast.",
    example: "₹1/kg saving × 200 kg/hr × 22 hrs × 25 days = ₹1,10,000/month per machine. With 2 machines, that's ₹26,40,000/year!"
  },
  6: {
    scenario: "It's peak season (post-Diwali to March). Orders are at maximum. Suddenly, your biggest customer needs a new color development urgently.",
    problem: "You can't say no to your biggest customer, but stopping production for trials means losing regular orders and revenue. It's a lose-lose situation.",
    solution: "The lab machine handles urgent customer trials while your production lines keep running at full capacity. You never have to choose between serving key customers and maintaining production.",
    example: "Assuming 2 such peak season emergencies a year, each causing ₹25,000 in lost production = ₹50,000/year."
  },
};

export function ExplainModal({ isOpen, onClose, painId, title }: ExplainModalProps) {
  const explanation = painExplanations[painId];

  if (!explanation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#E07A5F] px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-white/70 text-sm">Pain Point #{painId}</span>
                <h2 className="text-xl font-bold text-white">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Scenario */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#E07A5F] uppercase tracking-wider mb-2">
                  The Scenario
                </h3>
                <p className="text-[#1A1A1A] leading-relaxed">
                  {explanation.scenario}
                </p>
              </div>

              {/* Problem */}
              <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-2">
                  The Problem
                </h3>
                <p className="text-[#1A1A1A] leading-relaxed">
                  {explanation.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-6 bg-green-50 border border-green-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2">
                  The Solution
                </h3>
                <p className="text-[#1A1A1A] leading-relaxed">
                  {explanation.solution}
                </p>
              </div>

              {/* Example Calculation */}
              {explanation.example && (
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                    Example Calculation
                  </h3>
                  <p className="text-[#1A1A1A] leading-relaxed font-medium">
                    {explanation.example}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
              <Button onClick={onClose} className="w-full">
                Got it!
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
