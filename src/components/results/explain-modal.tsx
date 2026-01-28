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

// Detailed explanations for each pain point with crystal-clear math
const painExplanations: Record<number, {
  scenario: string;
  problem: string;
  solution: string;
  mathBreakdown: string[];
  nonTangible?: string[];
}> = {
  1: {
    scenario: "Picture this: Your masterbatch color looks perfect. Sample approved. Production done. Order shipped. Two weeks later: 'The color faded after stretching. We're rejecting the entire batch.'",
    problem: "This happens because lab samples don't go through the same stretching process as production. The color you see in your lab is NOT the color your customer gets.",
    solution: "The 25mm Lab Raffia Tape Line stretches the tape exactly like your production line (5.5 to 7.0 stretch ratios). You test with just 4.5-6 kg of material instead of 1,000+ kg on production. The color you see is the color your customer gets.",
    mathBreakdown: [
      "To test properly, here's what it costs:",
      "• Your machine output: 200 kg per hour",
      "• Trial run time: 3 hours per batch",
      "• Material used: 200 kg × 3 hours = 600 kg",
      "• Material cost: ₹100 per kg",
      "• Processing cost: ₹10 per kg",
      "• Total cost per kg: ₹110",
      "• Cost per trial: 600 kg × ₹110 = ₹66,000",
      "",
      "This happens: Once per month",
      "• Monthly loss: ₹66,000",
      "• Annual loss: ₹66,000 × 12 = ₹7.92 Lakhs"
    ],
    nonTangible: [
      "Plus the non-tangible losses:",
      "• Transportation costs back and forth",
      "• Loss of confidence in front of your customer",
      "• Your customer losing face in front of THEIR customer",
      "• Stress of wondering if the color will hold"
    ]
  },
  2: {
    scenario: "A supplier launches a new pigment—₹10 cheaper per kg. But your machines are running full orders. You can't spare the line for trials. So you ignore it.",
    problem: "Here's what you're missing: Trial cost on main machine = ₹50,000 per attempt. You skip it. But if that pigment saved just ₹1 per kg...",
    solution: "With the lab machine, you can test new pigments anytime without stopping production. Even a tiny ₹1/kg saving multiplies across your entire production volume.",
    mathBreakdown: [
      "The missed opportunity:",
      "• Machine output: 200 kg per hour",
      "• Running hours per day: 20 hours",
      "• Working days per month: 25 days",
      "",
      "If pigment saves just ₹1 per kg:",
      "• Monthly savings: ₹1 × 200 kg × 20 hrs × 25 days = ₹1,00,000",
      "• Annual savings: ₹1,00,000 × 12 = ₹12 Lakhs",
      "",
      "₹12 Lakhs in profit. From just ₹1 per kg savings.",
      "That you never discovered."
    ]
  },
  3: {
    scenario: "A customer needs 5-10 kg for their trial run. Your production line can't handle such small quantities.",
    problem: "The math: Customer needs 5-10 kg. Your minimum production: Much higher. You either waste material or lose the customer.",
    solution: "The lab line produces exactly the small quantities needed for customer trials without wasting material or stopping production.",
    mathBreakdown: [
      "The cost of small batch problems:",
      "• Customer needs: 5-10 kg",
      "• Your minimum production: Much higher",
      "• Loss per case (material wastage + production loss): ₹25,000",
      "• This happens: 3 times per year",
      "",
      "Annual loss: ₹25,000 × 3 = ₹75,000",
      "",
      "You either waste material or lose the customer."
    ]
  },
  4: {
    scenario: "Your new lab incharge has ideas—new recipes that could improve functionality or reduce costs. But testing means stopping production.",
    problem: "The cost of blocked innovation: Each innovation test requires production line. Loss per test (material + production time) = ₹25,000. Potential innovations per year: 3.",
    solution: "The lab machine becomes your dedicated R&D tool. Your team can experiment freely, try new formulations, and innovate without touching production.",
    mathBreakdown: [
      "Innovation blocked:",
      "• Each innovation test requires production line",
      "• Loss per test (material + production time): ₹25,000",
      "• Potential innovations per year: 3",
      "",
      "Annual loss: ₹25,000 × 3 = ₹75,000",
      "",
      "₹75,000 in improvements. Never tested. Never realized."
    ]
  },
  5: {
    scenario: "Your competitor dropped prices by ₹3 per kg. Their secret? 20% recycled material. You want to test 10-15% recycled to compete.",
    problem: "But here's the problem: Testing on production line is expensive. You hesitate and don't test. Even if you save just ₹1 per kg...",
    solution: "Test recycled material blends safely on the lab line. Find the perfect mix that maintains quality while reducing costs. Your competitor is capturing this profit. You're watching it slip away.",
    mathBreakdown: [
      "The competitive pressure:",
      "• Machine output: 200 kg per hour",
      "• Running hours per day: 20 hours",
      "• Working days per month: 25 days",
      "",
      "Even if you save just ₹1 per kg:",
      "• Monthly savings: ₹1 × 200 kg × 20 hrs × 25 days = ₹1,00,000",
      "• Annual savings: ₹1,00,000 × 12 = ₹12 Lakhs",
      "• Per machine",
      "",
      "Have multiple machines? Multiply that.",
      "Your competitor is capturing this profit. You're watching it slip away."
    ]
  },
  6: {
    scenario: "It's peak season—Diwali to March. Your biggest customer calls with a new color requirement. You can't say no.",
    problem: "The damage: You stop regular production for trials. During your most profitable season.",
    solution: "The lab machine handles urgent customer trials while your production lines keep running at full capacity during peak season.",
    mathBreakdown: [
      "Peak season nightmare:",
      "• You stop regular production for trials",
      "• Loss per case (production stoppage + wastage): ₹25,000",
      "• This happens: 2 times per year",
      "",
      "Annual loss: ₹25,000 × 2 = ₹50,000",
      "",
      "During your most profitable season."
    ]
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
            <div className="p-6 max-h-[70vh] overflow-y-auto">
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

              {/* Crystal Clear Math Breakdown */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  Crystal Clear Math
                </h3>
                <div className="space-y-1">
                  {explanation.mathBreakdown.map((line, idx) => (
                    <p
                      key={idx}
                      className={`${
                        line.startsWith('•')
                          ? 'text-[#1A1A1A] pl-2'
                          : line === ''
                          ? 'h-2'
                          : line.includes('Annual loss:') || line.includes('Monthly loss:')
                          ? 'text-[#E07A5F] font-bold text-lg mt-2'
                          : line.includes('Lakhs')
                          ? 'text-[#E07A5F] font-bold text-base'
                          : 'text-[#1A1A1A] font-semibold mt-3'
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Non-Tangible Losses */}
              {explanation.nonTangible && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                    ⚠️ Hidden Costs
                  </h3>
                  <div className="space-y-1">
                    {explanation.nonTangible.map((line, idx) => (
                      <p
                        key={idx}
                        className={`${
                          line.startsWith('•') ? 'text-[#1A1A1A] text-sm pl-2' : 'text-[#1A1A1A] font-medium mb-2'
                        }`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
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
