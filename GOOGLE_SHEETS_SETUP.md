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

   **Easiest Method:** Copy the text below and paste into cell A1 (it's tab-separated so will fill all columns):
   ```
   Timestamp	Name	Email	Phone	Company	Total Annual Impact	Output Per Hour (kg/hr)	Working Hours Per Day	Working Days Per Month	Material Cost Per Kg (₹)	Processing Cost Per Kg (₹)	Pain 1 Selected	Pain 1 Annual Loss	Pain 1 Monthly Loss	Pain 1 - Rejected Trials/Month	Pain 1 - Run Time Per Batch (hrs)	Pain 2 Selected	Pain 2 Annual Loss	Pain 2 Monthly Loss	Pain 2 - Pigment Savings Per Kg (₹)	Pain 3 Selected	Pain 3 Annual Loss	Pain 3 Monthly Loss	Pain 3 - Small Batch Requests/Year	Pain 3 - Loss Per Case (₹)	Pain 4 Selected	Pain 4 Annual Loss	Pain 4 Monthly Loss	Pain 4 - Experiment Requests/Year	Pain 4 - Loss Per Case (₹)	Pain 5 Selected	Pain 5 Annual Loss	Pain 5 Monthly Loss	Pain 5 - Recycled Material Savings Per Kg (₹)	Pain 5 - Number of Machines	Pain 6 Selected	Pain 6 Annual Loss	Pain 6 Monthly Loss	Pain 6 - Peak Season Requests/Year	Pain 6 - Loss Per Case (₹)
   ```

   **Or manually enter these headers:**

   **Lead Info (A-F):** Timestamp | Name | Email | Phone | Company | Total Annual Impact

   **Factory Settings (G-K):** Output Per Hour (kg/hr) | Working Hours Per Day | Working Days Per Month | Material Cost Per Kg (₹) | Processing Cost Per Kg (₹)

   **Pain 1 - Color Rejection (L-P):** Pain 1 Selected | Pain 1 Annual Loss | Pain 1 Monthly Loss | Pain 1 - Rejected Trials/Month | Pain 1 - Run Time Per Batch (hrs)

   **Pain 2 - R&D Pigments (Q-T):** Pain 2 Selected | Pain 2 Annual Loss | Pain 2 Monthly Loss | Pain 2 - Pigment Savings Per Kg (₹)

   **Pain 3 - Small Batch Trials (U-Y):** Pain 3 Selected | Pain 3 Annual Loss | Pain 3 Monthly Loss | Pain 3 - Small Batch Requests/Year | Pain 3 - Loss Per Case (₹)

   **Pain 4 - Lab Experiments (Z-AD):** Pain 4 Selected | Pain 4 Annual Loss | Pain 4 Monthly Loss | Pain 4 - Experiment Requests/Year | Pain 4 - Loss Per Case (₹)

   **Pain 5 - Recycled Material (AE-AI):** Pain 5 Selected | Pain 5 Annual Loss | Pain 5 Monthly Loss | Pain 5 - Recycled Material Savings Per Kg (₹) | Pain 5 - Number of Machines

   **Pain 6 - Peak Season Trials (AJ-AN):** Pain 6 Selected | Pain 6 Annual Loss | Pain 6 Monthly Loss | Pain 6 - Peak Season Requests/Year | Pain 6 - Loss Per Case (₹)

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
- Lead contact info: Name, email, phone, company name
- Total annual impact (calculated savings)
- Factory settings: All 5 parameters (output, hours, days, costs)
- For EACH pain point (6 total):
  - Whether it was selected
  - Annual and monthly loss amounts
  - Every adjustable parameter the user modified

**Best Practices:**
- Keep your Spreadsheet ID and API key secret
- Don't share the Google Sheet link publicly
- Regularly review and delete old data to comply with privacy regulations
- Consider setting up automatic email notifications when new submissions arrive
- For GDPR compliance, inform users that their data will be stored

---

## What Gets Saved

Each form submission creates a new row with **40 columns** of detailed data:

### Lead Information (6 columns)
- Timestamp, Name, Email, Phone, Company, Total Annual Impact

### Factory Settings (5 columns)
Every parameter the user set for their factory:
- Output per hour (kg/hr)
- Working hours per day
- Working days per month
- Material cost per kg
- Processing cost per kg

### Pain Point 1: Color Rejection After Stretching (5 columns)
- Selected (YES/NO)
- Annual loss calculated
- Monthly loss calculated
- Rejected trials per month (user input)
- Run time per batch (user input)

### Pain Point 2: R&D on New Pigments (4 columns)
- Selected (YES/NO)
- Annual loss calculated
- Monthly loss calculated
- Pigment savings per kg (user input)

### Pain Point 3: Small Batch Customer Trials (5 columns)
- Selected (YES/NO)
- Annual loss calculated
- Monthly loss calculated
- Small batch requests per year (user input)
- Loss per case (user input)

### Pain Point 4: Lab In-charge Experiments (5 columns)
- Selected (YES/NO)
- Annual loss calculated
- Monthly loss calculated
- Experiment requests per year (user input)
- Loss per case (user input)

### Pain Point 5: Recycled Material Testing (5 columns)
- Selected (YES/NO)
- Annual loss calculated
- Monthly loss calculated
- Recycled material savings per kg (user input)
- Number of machines (user input)

### Pain Point 6: Peak Season Customer Trials (5 columns)
- Selected (YES/NO)
- Annual loss calculated
- Monthly loss calculated
- Peak season requests per year (user input)
- Loss per case (user input)

**Example Row:**
```
2026-01-27T10:30:45.123Z | Rajesh Kumar | rajesh@example.com | +91 98765 43210 | ABC Plastics Ltd | 5000000 | 200 | 22 | 25 | 100 | 10 | YES | 2376000 | 198000 | 1 | 3 | YES | 1320000 | 110000 | 1 | YES | 75000 | 6250 | 3 | 25000 | NO | 0 | 0 | 0 | 0 | YES | 1320000 | 110000 | 1 | 1 | NO | 0 | 0 | 0 | 0
```

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
