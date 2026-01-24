"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AllInputs, defaultInputs, PainResult, calculateAllPains } from "./calculations";

interface CalculatorContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  inputs: AllInputs;
  updateFactoryInput: (key: keyof AllInputs["factory"], value: number) => void;
  updatePainInput: (pain: keyof Omit<AllInputs, "factory">, key: string, value: number) => void;
  results: PainResult[];
  calculateResults: () => void;
  togglePainSelection: (painId: number) => void;
  totalSteps: number;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<AllInputs>(defaultInputs);
  const [results, setResults] = useState<PainResult[]>([]);

  const totalSteps = 10; // 5 factory + 5 pain-specific inputs (simplified)

  const updateFactoryInput = (key: keyof AllInputs["factory"], value: number) => {
    setInputs((prev) => ({
      ...prev,
      factory: {
        ...prev.factory,
        [key]: value,
      },
    }));
  };

  const updatePainInput = (pain: keyof Omit<AllInputs, "factory">, key: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [pain]: {
        ...prev[pain],
        [key]: value,
      },
    }));
  };

  const calculateResults = () => {
    const painResults = calculateAllPains(inputs);
    setResults(painResults);
  };

  const togglePainSelection = (painId: number) => {
    setResults((prev) =>
      prev.map((pain) =>
        pain.id === painId ? { ...pain, isSelected: !pain.isSelected } : pain
      )
    );
  };

  return (
    <CalculatorContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        inputs,
        updateFactoryInput,
        updatePainInput,
        results,
        calculateResults,
        togglePainSelection,
        totalSteps,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}
