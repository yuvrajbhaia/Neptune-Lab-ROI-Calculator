import { NextRequest, NextResponse } from 'next/server';

// This is a development-only API route that mimics the Cloudflare Function
// In production, Cloudflare Functions at /functions/api/submit/index.ts will be used instead

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('📊 ROI Calculator Submission (DEV):', {
      company: data.lead?.company,
      email: data.lead?.email,
      total: data.total,
      timestamp: new Date().toISOString(),
    });

    // In development, we don't have access to Cloudflare env vars
    // So we'll just return success without saving to Google Sheets
    console.warn('⚠️ Development mode: Google Sheets integration disabled');
    console.log('📝 Form data:', JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully (Development mode - not saved to Google Sheets)',
      dev: true,
    });

  } catch (error) {
    console.error('❌ Submission error:', error);

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully (with errors)',
      warning: error instanceof Error ? error.message : 'Unknown error occurred',
      dev: true,
    }, { status: 200 });
  }
}
