export async function onRequest(context: any) {
  try {
    const data = await context.request.json();

    // Log the submission
    console.log('📊 ROI Calculator Submission:', {
      company: data.lead?.company,
      email: data.lead?.email,
      total: data.total,
      timestamp: new Date().toISOString(),
    });

    // Get the Apps Script URL from environment variables
    const appsScriptUrl = context.env.GOOGLE_APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
      console.warn('⚠️ GOOGLE_APPS_SCRIPT_URL not configured, skipping Google Sheets submission');
      // Still return success for graceful degradation
      return new Response(JSON.stringify({
        success: true,
        message: 'Form submitted successfully (Google Sheets integration pending)',
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare data for Google Sheets
    const timestamp = new Date().toISOString();

    // Extract selected pain points
    const selectedPains = data.results.filter((r: any) => r.isSelected);

    const payload = {
      timestamp,
      lead: {
        ...data.lead,
        // Convert array to comma-separated string for Google Sheets
        quotationTypes: data.lead.quotationTypes?.join(", ") || "",
      },
      total: data.total,
      inputs: data.inputs,
      pain1: {
        selected: selectedPains.some((p: any) => p.id === 1) ? 'YES' : 'NO',
        annualLoss: selectedPains.find((p: any) => p.id === 1)?.annualLoss || 0,
        monthlyLoss: (selectedPains.find((p: any) => p.id === 1)?.annualLoss || 0) / 12,
      },
      pain2: {
        selected: selectedPains.some((p: any) => p.id === 2) ? 'YES' : 'NO',
        annualLoss: selectedPains.find((p: any) => p.id === 2)?.annualLoss || 0,
        monthlyLoss: (selectedPains.find((p: any) => p.id === 2)?.annualLoss || 0) / 12,
      },
      pain3: {
        selected: selectedPains.some((p: any) => p.id === 3) ? 'YES' : 'NO',
        annualLoss: selectedPains.find((p: any) => p.id === 3)?.annualLoss || 0,
        monthlyLoss: (selectedPains.find((p: any) => p.id === 3)?.annualLoss || 0) / 12,
      },
      pain4: {
        selected: selectedPains.some((p: any) => p.id === 4) ? 'YES' : 'NO',
        annualLoss: selectedPains.find((p: any) => p.id === 4)?.annualLoss || 0,
        monthlyLoss: (selectedPains.find((p: any) => p.id === 4)?.annualLoss || 0) / 12,
      },
      pain5: {
        selected: selectedPains.some((p: any) => p.id === 5) ? 'YES' : 'NO',
        annualLoss: selectedPains.find((p: any) => p.id === 5)?.annualLoss || 0,
        monthlyLoss: (selectedPains.find((p: any) => p.id === 5)?.annualLoss || 0) / 12,
      },
      pain6: {
        selected: selectedPains.some((p: any) => p.id === 6) ? 'YES' : 'NO',
        annualLoss: selectedPains.find((p: any) => p.id === 6)?.annualLoss || 0,
        monthlyLoss: (selectedPains.find((p: any) => p.id === 6)?.annualLoss || 0) / 12,
      },
    };

    console.log('📤 Sending to Google Sheets...', {
      url: appsScriptUrl,
      company: payload.lead.company,
    });

    // Submit to Google Apps Script
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('❌ Google Sheets submission failed:', response.status, response.statusText);
      // Still return success for graceful degradation
      return new Response(JSON.stringify({
        success: true,
        message: 'Form submitted successfully (Google Sheets sync failed)',
        warning: 'Data not saved to Google Sheets',
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();
    console.log('✅ Google Sheets submission successful:', result);

    return new Response(JSON.stringify({
      success: true,
      message: 'Form submitted and saved to Google Sheets successfully',
      data: result,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Submission error:', error);

    // Return success with warning for graceful degradation
    return new Response(JSON.stringify({
      success: true,
      message: 'Form submitted successfully (with errors)',
      warning: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
