// ROI Calculation Types
export interface FactorySettings {
  outputPerHour: number; // kg/hr (default: 200)
  workingHoursPerDay: number; // hrs (default: 22)
  workingDaysPerMonth: number; // days (default: 25)
  materialCostPerKg: number; // ₹ (default: 100)
  processingCostPerKg: number; // ₹ (default: 10)
}

export interface Pain1Inputs {
  rejectedTrialsPerMonth: number; // default: 1
  runTimePerBatch: number; // hours (default: 3)
}

export interface Pain2Inputs {
  pigmentSavingsPerKg: number; // ₹ (default: 1)
}

export interface Pain3Inputs {
  smallBatchRequestsPerYear: number; // default: 3
  lossPerCase: number; // ₹ (default: 25000)
}

export interface Pain4Inputs {
  experimentRequestsPerYear: number; // default: 3
  lossPerCase: number; // ₹ (default: 25000)
}

export interface Pain5Inputs {
  recycledMaterialSavingsPerKg: number; // ₹ (default: 1)
  numberOfMachines: number; // user input
}

export interface Pain6Inputs {
  peakSeasonRequestsPerYear: number; // default: 2
  lossPerCase: number; // ₹ (default: 25000)
}

export interface AllInputs {
  factory: FactorySettings;
  pain1: Pain1Inputs;
  pain2: Pain2Inputs;
  pain3: Pain3Inputs;
  pain4: Pain4Inputs;
  pain5: Pain5Inputs;
  pain6: Pain6Inputs;
}

export interface PainResult {
  id: number;
  title: string;
  description: string;
  annualLoss: number;
  monthlyLoss: number;
  isSelected: boolean;
}

// Default values
export const defaultFactorySettings: FactorySettings = {
  outputPerHour: 200,
  workingHoursPerDay: 22,
  workingDaysPerMonth: 25,
  materialCostPerKg: 100,
  processingCostPerKg: 10,
};

export const defaultInputs: AllInputs = {
  factory: defaultFactorySettings,
  pain1: {
    rejectedTrialsPerMonth: 1,
    runTimePerBatch: 3,
  },
  pain2: {
    pigmentSavingsPerKg: 1,
  },
  pain3: {
    smallBatchRequestsPerYear: 3,
    lossPerCase: 25000,
  },
  pain4: {
    experimentRequestsPerYear: 3,
    lossPerCase: 25000,
  },
  pain5: {
    recycledMaterialSavingsPerKg: 1,
    numberOfMachines: 1,
  },
  pain6: {
    peakSeasonRequestsPerYear: 2,
    lossPerCase: 25000,
  },
};

// Pain 1: Color Rejection After Stretching
// Formula: Rejected trials × Output × Run time × (Material cost + Processing cost) × 12
export function calculatePain1(factory: FactorySettings, pain1: Pain1Inputs): { monthly: number; annual: number } {
  const totalCostPerKg = factory.materialCostPerKg + factory.processingCostPerKg;
  const monthlyLoss = pain1.rejectedTrialsPerMonth * factory.outputPerHour * pain1.runTimePerBatch * totalCostPerKg;
  return {
    monthly: monthlyLoss,
    annual: monthlyLoss * 12,
  };
}

// Pain 2: R&D on New Pigments
// Formula: Savings per kg × Output × Working hours × Working days × 12
export function calculatePain2(factory: FactorySettings, pain2: Pain2Inputs): { monthly: number; annual: number } {
  const monthlySavings = pain2.pigmentSavingsPerKg * factory.outputPerHour * factory.workingHoursPerDay * factory.workingDaysPerMonth;
  return {
    monthly: monthlySavings,
    annual: monthlySavings * 12,
  };
}

// Pain 3: Small Batch Customer Trials
// Formula: Cases per year × Loss per case
export function calculatePain3(pain3: Pain3Inputs): { monthly: number; annual: number } {
  const annualLoss = pain3.smallBatchRequestsPerYear * pain3.lossPerCase;
  return {
    monthly: annualLoss / 12,
    annual: annualLoss,
  };
}

// Pain 4: New Lab In-charge Experiments
// Formula: Cases per year × Loss per case
export function calculatePain4(pain4: Pain4Inputs): { monthly: number; annual: number } {
  const annualLoss = pain4.experimentRequestsPerYear * pain4.lossPerCase;
  return {
    monthly: annualLoss / 12,
    annual: annualLoss,
  };
}

// Pain 5: Recycled Material Testing
// Formula: Savings per kg × Output × Working hours × Working days × Number of machines × 12
export function calculatePain5(factory: FactorySettings, pain5: Pain5Inputs): { monthly: number; annual: number } {
  const monthlySavings = pain5.recycledMaterialSavingsPerKg * factory.outputPerHour * factory.workingHoursPerDay * factory.workingDaysPerMonth * pain5.numberOfMachines;
  return {
    monthly: monthlySavings,
    annual: monthlySavings * 12,
  };
}

// Pain 6: Peak Season Big Customer Trials
// Formula: Cases per year × Loss per case
export function calculatePain6(pain6: Pain6Inputs): { monthly: number; annual: number } {
  const annualLoss = pain6.peakSeasonRequestsPerYear * pain6.lossPerCase;
  return {
    monthly: annualLoss / 12,
    annual: annualLoss,
  };
}

// Calculate all pain points
export function calculateAllPains(inputs: AllInputs): PainResult[] {
  const pain1Result = calculatePain1(inputs.factory, inputs.pain1);
  const pain2Result = calculatePain2(inputs.factory, inputs.pain2);
  const pain3Result = calculatePain3(inputs.pain3);
  const pain4Result = calculatePain4(inputs.pain4);
  const pain5Result = calculatePain5(inputs.factory, inputs.pain5);
  const pain6Result = calculatePain6(inputs.pain6);

  return [
    {
      id: 1,
      title: "Color Rejection After Stretching",
      description: "Loss from trial batches rejected after production because lab samples don't match stretched reality",
      annualLoss: pain1Result.annual,
      monthlyLoss: pain1Result.monthly,
      isSelected: true,
    },
    {
      id: 2,
      title: "Missed R&D Opportunities",
      description: "Savings lost by skipping trials of cheaper pigments because production lines can't be spared",
      annualLoss: pain2Result.annual,
      monthlyLoss: pain2Result.monthly,
      isSelected: true,
    },
    {
      id: 3,
      title: "Small Batch Customer Trials",
      description: "Material wastage or lost customers when you can't produce small 5-10 kg trial quantities",
      annualLoss: pain3Result.annual,
      monthlyLoss: pain3Result.monthly,
      isSelected: true,
    },
    {
      id: 4,
      title: "Innovation Blocked",
      description: "Cost savings and improvements never realized because experiments require stopping production",
      annualLoss: pain4Result.annual,
      monthlyLoss: pain4Result.monthly,
      isSelected: true,
    },
    {
      id: 5,
      title: "Competitive Pressure & Recycled Material",
      description: "Profit lost to competitors who tested and adopted recycled material blends while you couldn't",
      annualLoss: pain5Result.annual,
      monthlyLoss: pain5Result.monthly,
      isSelected: true,
    },
    {
      id: 6,
      title: "Peak Season Nightmare",
      description: "Production stoppage during most profitable season for urgent customer color trials",
      annualLoss: pain6Result.annual,
      monthlyLoss: pain6Result.monthly,
      isSelected: true,
    },
  ];
}

// Calculate total from selected pain points
export function calculateTotal(painResults: PainResult[]): number {
  return painResults
    .filter(pain => pain.isSelected)
    .reduce((total, pain) => total + pain.annualLoss, 0);
}
