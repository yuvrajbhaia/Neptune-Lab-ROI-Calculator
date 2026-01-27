// Cloudflare Pages Function for form submission
// This replaces the Next.js API route for static exports

interface Env {
  GOOGLE_SHEETS_API_KEY: string;
  GOOGLE_SHEETS_SPREADSHEET_ID: string;
}

interface FactorySettings {
  outputPerHour: number;
  workingHoursPerDay: number;
  workingDaysPerMonth: number;
  materialCostPerKg: number;
  processingCostPerKg: number;
}

interface Pain1Inputs {
  rejectedTrialsPerMonth: number;
  runTimePerBatch: number;
}

interface Pain2Inputs {
  pigmentSavingsPerKg: number;
}

interface Pain3Inputs {
  smallBatchRequestsPerYear: number;
  lossPerCase: number;
}

interface Pain4Inputs {
  experimentRequestsPerYear: number;
  lossPerCase: number;
}

interface Pain5Inputs {
  recycledMaterialSavingsPerKg: number;
  numberOfMachines: number;
}

interface Pain6Inputs {
  peakSeasonRequestsPerYear: number;
  lossPerCase: number;
}

interface AllInputs {
  factory: FactorySettings;
  pain1: Pain1Inputs;
  pain2: Pain2Inputs;
  pain3: Pain3Inputs;
  pain4: Pain4Inputs;
  pain5: Pain5Inputs;
  pain6: Pain6Inputs;
}

interface PainResult {
  id: number;
  title: string;
  description: string;
  annualLoss: number;
  monthlyLoss: number;
  isSelected: boolean;
}

interface SubmissionData {
  lead: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  inputs: AllInputs;
  results: PainResult[];
  total: number;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // CORS headers for the response
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS request for CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await request.json()) as SubmissionData;
    const { lead, inputs, results, total } = body;

    // Validate required fields
    if (!lead || !lead.name || !lead.email || !lead.phone || !lead.company) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log submission
    console.log("=== New ROI Calculator Submission ===");
    console.log("Lead:", lead);
    console.log("Total Annual Impact:", total);
    console.log(
      "Selected Pain Points:",
      results.filter((r) => r.isSelected).length
    );

    // Append to Google Sheets if credentials are configured
    if (env.GOOGLE_SHEETS_API_KEY && env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      try {
        await appendToGoogleSheet(env, {
          lead,
          inputs,
          results,
          total,
          timestamp: new Date().toISOString(),
        });
        console.log("✅ Successfully saved to Google Sheets");
      } catch (sheetError) {
        console.error("❌ Google Sheets error:", sheetError);
        // Don't fail the request if Sheets fails
      }
    } else {
      console.log("⚠️ Google Sheets not configured - skipping");
    }

    // TODO: Add Resend email integration here
    // if (env.RESEND_API_KEY) {
    //   await sendEmail(env, lead, total);
    // }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Form submitted successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

// Append data to Google Sheets using Google Sheets API v4
async function appendToGoogleSheet(
  env: Env,
  data: {
    lead: { name: string; email: string; phone: string; company: string };
    inputs: AllInputs;
    results: PainResult[];
    total: number;
    timestamp: string;
  }
) {
  const { GOOGLE_SHEETS_API_KEY, GOOGLE_SHEETS_SPREADSHEET_ID } = env;
  const { lead, inputs, results, total, timestamp } = data;

  // Helper to get pain point data
  const getPainData = (painId: number) => {
    const pain = results.find((r) => r.id === painId);
    return {
      selected: pain?.isSelected ? "YES" : "NO",
      annualLoss: pain?.annualLoss || 0,
      monthlyLoss: pain?.monthlyLoss || 0,
    };
  };

  const pain1 = getPainData(1);
  const pain2 = getPainData(2);
  const pain3 = getPainData(3);
  const pain4 = getPainData(4);
  const pain5 = getPainData(5);
  const pain6 = getPainData(6);

  // Prepare row data with ALL details
  const values = [
    [
      // Submission Info
      timestamp,
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      total,

      // Factory Settings
      inputs.factory.outputPerHour,
      inputs.factory.workingHoursPerDay,
      inputs.factory.workingDaysPerMonth,
      inputs.factory.materialCostPerKg,
      inputs.factory.processingCostPerKg,

      // Pain 1: Color Rejection After Stretching
      pain1.selected,
      pain1.annualLoss,
      pain1.monthlyLoss,
      inputs.pain1.rejectedTrialsPerMonth,
      inputs.pain1.runTimePerBatch,

      // Pain 2: R&D on New Pigments
      pain2.selected,
      pain2.annualLoss,
      pain2.monthlyLoss,
      inputs.pain2.pigmentSavingsPerKg,

      // Pain 3: Small Batch Customer Trials
      pain3.selected,
      pain3.annualLoss,
      pain3.monthlyLoss,
      inputs.pain3.smallBatchRequestsPerYear,
      inputs.pain3.lossPerCase,

      // Pain 4: Lab In-charge Experiments
      pain4.selected,
      pain4.annualLoss,
      pain4.monthlyLoss,
      inputs.pain4.experimentRequestsPerYear,
      inputs.pain4.lossPerCase,

      // Pain 5: Recycled Material Testing
      pain5.selected,
      pain5.annualLoss,
      pain5.monthlyLoss,
      inputs.pain5.recycledMaterialSavingsPerKg,
      inputs.pain5.numberOfMachines,

      // Pain 6: Peak Season Customer Trials
      pain6.selected,
      pain6.annualLoss,
      pain6.monthlyLoss,
      inputs.pain6.peakSeasonRequestsPerYear,
      inputs.pain6.lossPerCase,
    ],
  ];

  // Google Sheets API endpoint - now uses columns A to AO (41 columns)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_SPREADSHEET_ID}/values/Sheet1!A:AO:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Google Sheets API error: ${response.status} - ${errorText}`
    );
  }

  return await response.json();
}
