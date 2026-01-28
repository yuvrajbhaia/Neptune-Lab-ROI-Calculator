import React from 'react'
import { motion } from 'framer-motion'
import { CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onContinue?: () => void;
  onBack?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  continueLabel?: string;
  backLabel?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  onContinue,
  onBack,
  isFirstStep = false,
  isLastStep = false,
  continueLabel = 'Continue',
  backLabel = 'Back',
}) => {
  const isExpanded = isFirstStep;

  // Calculate green bar width based on current step
  // Gap between dots is 24px (gap-6), dot width is 8px (w-2)
  const getGreenBarWidth = () => {
    if (currentStep === 1) return 8; // Just cover first dot
    // For each additional step: add (dotWidth + gap)
    return 8 + ((currentStep - 1) * 32); // 8px dot + 24px gap = 32px per step
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Progress dots */}
      <div className="flex items-center gap-6 relative">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          return (
            <div
              key={step}
              className={cn(
                "w-2 h-2 rounded-full relative z-10 transition-colors duration-300",
                step <= currentStep ? "bg-green-500" : "bg-gray-300"
              )}
            />
          );
        })}

        {/* Green progress overlay - aligned with dots */}
        <motion.div
          animate={{
            width: getGreenBarWidth(),
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-green-500 rounded-full"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.8,
          }}
        />
      </div>

      {/* Buttons container */}
      <div className="w-full">
        <motion.div
          className="flex items-center gap-2"
          animate={{
            justifyContent: isExpanded ? 'stretch' : 'space-between'
          }}
        >
          {!isExpanded && onBack && (
            <motion.button
              initial={{ opacity: 0, width: 0, scale: 0.8 }}
              animate={{ opacity: 1, width: "auto", scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                mass: 0.5,
              }}
              onClick={onBack}
              className="px-5 py-2.5 text-black flex items-center justify-center bg-gray-100 font-semibold rounded-full hover:bg-gray-200 transition-colors text-sm"
            >
              {backLabel}
            </motion.button>
          )}
          <motion.button
            onClick={onContinue}
            animate={{
              flex: isExpanded ? 1 : 'inherit',
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="px-6 py-2.5 rounded-full text-white bg-[#006cff] hover:bg-[#0052cc] transition-colors font-semibold text-sm flex-1"
          >
            <div className="flex items-center justify-center gap-2">
              {isLastStep && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                    mass: 0.5,
                    bounce: 0.4
                  }}
                >
                  <CircleCheck size={16} />
                </motion.div>
              )}
              {isLastStep ? 'Finish' : continueLabel}
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
