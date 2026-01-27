// Cloudflare Pages Function for form submission
// This replaces the Next.js API route for static exports

interface Env {
  GOOGLE_APPS_SCRIPT_URL: string; // Apps Script Web App deployment URL
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

    // Append to Google Sheets via Apps Script webhook
    let sheetsStatus = "not_configured";
    let sheetsError = null;

    if (env.GOOGLE_APPS_SCRIPT_URL) {
      try {
        await sendToAppsScript(env.GOOGLE_APPS_SCRIPT_URL, {
          lead,
          inputs,
          results,
          total,
          timestamp: new Date().toISOString(),
        });
        console.log("✅ Successfully saved to Google Sheets via Apps Script");
        sheetsStatus = "success";
      } catch (sheetError) {
        console.error("❌ Apps Script webhook error:", sheetError);
        sheetsStatus = "failed";
        sheetsError = sheetError instanceof Error ? sheetError.message : String(sheetError);
        // Don't fail the request if Sheets fails (graceful degradation)
      }
    } else {
      console.log("⚠️ Apps Script webhook not configured - skipping");
    }

    // TODO: Add Resend email integration here
    // if (env.RESEND_API_KEY) {
    //   await sendEmail(env, lead, total);
    // }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Form submitted successfully",
        sheets_status: sheetsStatus,
        sheets_error: sheetsError,
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

// Send data to Google Apps Script webhook (same approach as your working HTML example)
async function sendToAppsScript(
  webhookUrl: string,
  data: {
    lead: { name: string; email: string; phone: string; company: string };
    inputs: AllInputs;
    results: PainResult[];
    total: number;
    timestamp: string;
  }
) {
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

  // Build payload in the format the Apps Script expects
  const payload = {
    timestamp,
    lead,
    total,
    inputs,
    pain1,
    pain2,
    pain3,
    pain4,
    pain5,
    pain6,
  };

  // Send to Apps Script webhook
  // Using same approach as your working HTML example
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Apps Script returns 302 redirect on success, which is normal
  // Check if response is ok (2xx or 3xx status codes)
  if (!response.ok && response.status !== 302) {
    const errorText = await response.text().catch(() => "Unable to read error");
    throw new Error(
      `Apps Script webhook error: ${response.status} - ${errorText}`
    );
  }

  // Try to parse JSON response (Apps Script returns JSON on success)
  try {
    return await response.json();
  } catch {
    // If can't parse JSON, it's likely a redirect which is fine
    return { success: true, message: "Data sent successfully" };
  }
}
