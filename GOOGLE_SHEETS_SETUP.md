# Google Sheets Integration Setup Guide

This guide walks you through setting up Google Sheets to automatically save ROI calculator submissions.

## Quick Overview

When a user submits the ROI calculator form, their data (name, email, phone, company, total savings, selected pain points) will be automatically saved to your Google Sheet.

---

## Step-by-Step Setup

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Rename it to something like "Neptune ROI Calculator Leads"
4. **Add these column headers in Row 1:**
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Company`
   - F1: `Total Annual Impact`
   - G1: `Selected Pain Points`
   - H1: `Pain Point Details`
   - I1: `Raw Inputs`

5. **Copy the Spreadsheet ID:**
   - Look at the URL: `https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit`
   - The Spreadsheet ID is the long string between `/d/` and `/edit`
   - Example: `1ABC123xyz...` ← Copy this

---

### 2. Get Google Sheets API Key

1. Go to [Google Cloud Console - API Credentials](https://console.cloud.google.com/apis/credentials)

2. **Create or Select a Project:**
   - If you don't have a project: Click **Create Project**
   - Name it "Neptune ROI Calculator" (or anything you prefer)
   - Click **Create**

3. **Enable Google Sheets API:**
   - Go to [Google Sheets API Library](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
   - Click **Enable**

4. **Create API Key:**
   - Go back to [API Credentials](https://console.cloud.google.com/apis/credentials)
   - Click **+ Create Credentials** > **API Key**
   - Copy the API key that appears (it starts with `AIza...`)

5. **Optional - Restrict API Key (Recommended for security):**
   - Click on your API key to edit it
   - Under "API restrictions", select **Restrict key**
   - Choose **Google Sheets API** from the dropdown
   - Under "Application restrictions", select **HTTP referrers**
   - Add your domain: `neptuneplasticlab.in/*` and `*.pages.dev/*`
   - Click **Save**

---

### 3. Make Your Spreadsheet Publicly Writable

**IMPORTANT:** The API needs permission to write to your sheet.

1. Open your Google Sheet
2. Click the **Share** button (top right)
3. Under "General access", click **Restricted** dropdown
4. Select **Anyone with the link**
5. Change role from "Viewer" to **Editor**
6. Click **Done**

**Why this is safe:**
- Only people with the link can access it (not searchable on Google)
- The link is only known by your Cloudflare Worker (not exposed publicly)
- You can always revoke access later if needed

---

### 4. Add Environment Variables to Cloudflare Pages

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click on your project: **neptune-lab-roi-calculator**
4. Go to **Settings** tab
5. Click **Environment variables** section

6. **Add Production Variables:**
   - Click **Add variable**
   - Variable name: `GOOGLE_SHEETS_API_KEY`
   - Value: (paste your API key from Step 2)
   - Click **Save**

   - Click **Add variable** again
   - Variable name: `GOOGLE_SHEETS_SPREADSHEET_ID`
   - Value: (paste your Spreadsheet ID from Step 1)
   - Click **Save**

7. **Add Preview Variables (optional but recommended):**
   - Switch to **Preview** tab at the top
   - Add the same two variables
   - This allows testing on preview deployments

---

### 5. Trigger a New Deployment

After adding environment variables, you need to redeploy:

**Option A: Push a change to GitHub (recommended)**
```bash
git commit --allow-empty -m "Trigger deployment with Google Sheets env vars"
git push
```

**Option B: Manual redeploy in Cloudflare Dashboard**
1. Go to **Deployments** tab
2. Click **View build** on the latest deployment
3. Click **Retry deployment**

---

## Testing

1. Wait for the new deployment to complete (2-3 minutes)
2. Visit your site and go through the calculator
3. Fill in all pain points and submit the form
4. Check your Google Sheet - you should see a new row with the submission data!

---

## Troubleshooting

### "Google Sheets not configured - skipping"
- This means environment variables are not set in Cloudflare
- Double-check you added both variables in Settings > Environment variables
- Make sure you triggered a new deployment after adding them

### "Google Sheets API error: 403"
- Your API key doesn't have access to the Sheets API
- Go back to Step 2 and make sure you enabled the Google Sheets API
- If you restricted the API key, make sure Google Sheets API is in the allowed list

### "Google Sheets API error: 404"
- The Spreadsheet ID is incorrect
- Double-check you copied the right part of the URL (between `/d/` and `/edit`)

### "Google Sheets API error: 401"
- The spreadsheet is not publicly accessible
- Go back to Step 3 and make sure "Anyone with the link" has "Editor" access

### Data appears as plain text in one column
- Make sure your Sheet1 tab is named exactly "Sheet1"
- Or update the function code to match your tab name

---

## Data Privacy & Security

**What data is collected:**
- Name, email, phone, company name
- Total annual impact (calculated savings)
- Selected pain points and their details
- Raw calculator inputs (JSON format)

**Best Practices:**
- Keep your Spreadsheet ID and API key secret
- Don't share the Google Sheet link publicly
- Regularly review and delete old data to comply with privacy regulations
- Consider setting up automatic email notifications when new submissions arrive
- For GDPR compliance, inform users that their data will be stored

---

## What Gets Saved

Each form submission creates a new row with these columns:

| Column | Example |
|--------|---------|
| Timestamp | 2026-01-27T10:30:45.123Z |
| Name | Rajesh Kumar |
| Email | rajesh@example.com |
| Phone | +91 98765 43210 |
| Company | ABC Plastics Ltd |
| Total Annual Impact | 5000000 |
| Selected Pain Points | 3 |
| Pain Point Details | Batch Rejections: ₹2,000,000 \| Pigment Waste: ₹1,500,000 \| Small Batches: ₹1,500,000 |
| Raw Inputs | {"pain1":{"rejectedTrialsPerMonth":5,...},...} |

---

## Future Enhancements

Once Google Sheets is working, you can add:

1. **Email Notifications:** Get notified when a new lead submits
2. **Auto-responder:** Send a thank you email with PDF report
3. **CRM Integration:** Connect to HubSpot, Salesforce, etc.
4. **Analytics Dashboard:** Visualize lead data with Google Data Studio

---

## Need Help?

If you run into issues:
1. Check the browser console for error messages (F12 > Console tab)
2. Check Cloudflare Functions logs in the dashboard
3. Verify your API key works by testing it manually with Google Sheets API

---

**That's it!** Your ROI calculator will now automatically save all submissions to Google Sheets. 🎉
