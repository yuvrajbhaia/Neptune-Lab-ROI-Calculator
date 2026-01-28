"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PainInput {
  label: string;
  field: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

interface PainCardProps {
  id: number;
  title: string;
  description: string;
  annualLoss: number;
  isSelected: boolean;
  onToggle: () => void;
  onExplain: () => void;
  inputs?: PainInput[];
  onInputChange?: (field: string, value: number) => void;
}

export function PainCard({
  id,
  title,
  description,
  annualLoss,
  isSelected,
  onToggle,
  onExplain,
  inputs = [],
  onInputChange,
}: PainCardProps) {
  const [showInputs, setShowInputs] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: id * 0.05 }}
      onClick={onToggle}
      className={`
        relative p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? "border-[#E07A5F] bg-[#E07A5F]/5"
            : "border-[#E5E7EB] bg-white hover:border-[#E07A5F]/30"
        }
      `}
    >
      {/* Top Row: Checkbox + Title + Explain Button */}
      <div className="flex items-start gap-3 mb-3">
        {/* Checkbox */}
        <div
          className={`
            flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all mt-0.5
            ${
              isSelected
                ? "border-[#E07A5F] bg-[#E07A5F]"
                : "border-[#D1D5DB]"
            }
          `}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-[#1A1A1A] leading-tight">
              {title}
            </h3>
            {/* Explain Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExplain();
              }}
              className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-[#E07A5F] hover:text-[#C96A51] transition-colors px-2 py-1 rounded-md hover:bg-[#E07A5F]/10"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Explain
            </button>
          </div>
          <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Inline Inputs (Collapsible) */}
      {inputs.length > 0 && isSelected && (
        <div className="mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInputs(!showInputs);
            }}
            className="flex items-center gap-1 text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-colors mb-2"
          >
            {showInputs ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {showInputs ? "Hide" : "Adjust"} parameters
          </button>

          {showInputs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pl-9"
              onClick={(e) => e.stopPropagation()}
            >
              {inputs.map((input) => (
                <div key={input.field} className="flex items-center gap-2">
                  <label className="text-xs text-[#6B7280] flex-1 min-w-0">
                    {input.label}
                  </label>
                  <div className="relative flex items-center">
                    {input.prefix && (
                      <span className="text-xs text-[#6B7280] mr-1">
                        {input.prefix}
                      </span>
                    )}
                    <input
                      type="number"
                      value={input.value}
                      onChange={(e) =>
                        onInputChange?.(input.field, parseFloat(e.target.value) || 0)
                      }
                      className="w-20 h-8 px-2 text-sm text-center border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20 focus:border-[#E07A5F]"
                    />
                    {input.suffix && (
                      <span className="text-xs text-[#6B7280] ml-1">
                        {input.suffix}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Annual Loss */}
      <div className="pt-3 border-t border-[#E5E7EB] pl-9">
        <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">
          Annual Impact
        </p>
        <p className={`text-xl font-bold ${isSelected ? "text-[#E07A5F]" : "text-[#1A1A1A]"}`}>
          {formatCurrency(annualLoss)}
        </p>
      </div>
    </motion.div>
  );
}
