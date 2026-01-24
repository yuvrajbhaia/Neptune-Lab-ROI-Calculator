import { NextRequest, NextResponse } from "next/server";

// This API route handles form submission
// In production, add:
// 1. Google Sheets integration
// 2. Resend email integration
// 3. PDF generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, inputs, results, total } = body;

    // Validate required fields
    if (!lead || !lead.name || !lead.email || !lead.phone || !lead.company) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the submission (replace with actual integrations)
    console.log("=== New ROI Calculator Submission ===");
    console.log("Lead:", lead);
    console.log("Total Annual Impact:", total);
    console.log("Selected Pain Points:", results.filter((r: { isSelected: boolean }) => r.isSelected).length);

    // TODO: Add Google Sheets integration
    // await appendToGoogleSheet({
    //   timestamp: new Date().toISOString(),
    //   ...lead,
    //   total,
    //   inputs: JSON.stringify(inputs),
    // });

    // TODO: Add Resend email integration
    // await sendEmail({
    //   to: lead.email,
    //   subject: "Your Neptune Plastics ROI Report",
    //   // ... email content with PDF attachment
    // });

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
