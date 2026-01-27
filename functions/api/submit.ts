// Cloudflare Pages Function for form submission
// This replaces the Next.js API route for static exports

interface Env {
  GOOGLE_SHEETS_API_KEY: string;
  GOOGLE_SHEETS_SPREADSHEET_ID: string;
}

interface SubmissionData {
  lead: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  inputs: Record<string, unknown>;
  results: Array<{ id: number; title: string; annualLoss: number; isSelected: boolean }>;
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
          timestamp: new Date().toISOString(),
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          totalAnnualImpact: total,
          selectedPainPoints: results.filter((r) => r.isSelected).length,
          painPointDetails: results
            .filter((r) => r.isSelected)
            .map((r) => `${r.title}: ₹${r.annualLoss.toLocaleString("en-IN")}`)
            .join(" | "),
          inputs: JSON.stringify(inputs),
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
    timestamp: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    totalAnnualImpact: number;
    selectedPainPoints: number;
    painPointDetails: string;
    inputs: string;
  }
) {
  const { GOOGLE_SHEETS_API_KEY, GOOGLE_SHEETS_SPREADSHEET_ID } = env;

  // Prepare row data
  const values = [
    [
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.company,
      data.totalAnnualImpact,
      data.selectedPainPoints,
      data.painPointDetails,
      data.inputs,
    ],
  ];

  // Google Sheets API endpoint
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_SPREADSHEET_ID}/values/Sheet1!A:I:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`;

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
    throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
