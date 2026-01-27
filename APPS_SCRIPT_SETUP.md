# Google Apps Script Webhook Setup Guide

This guide shows you how to set up Google Sheets integration using **Google Apps Script** - the same approach used in your working HTML calculator.

## Why Apps Script Instead of API Key?

**The problem with Google Sheets API:**
- ❌ Requires OAuth2 for write operations (API keys only work for reading)
- ❌ Complex authentication flow
- ❌ Returns 401 error when trying to write with just an API key

**The Apps Script solution:**
- ✅ Runs with YOUR Google account permissions (no OAuth needed)
- ✅ Simple webhook URL - just POST data to it
- ✅ Same approach as your working HTML calculator
- ✅ Free and easy to set up

---

## Step-by-Step Setup

### Step 1: Open Your Google Sheet

1. Open your existing Google Sheet: https://docs.google.com/spreadsheets/d/1q4h9UWiLtVRrE7pf-V8R89ikSJquAncvUPZDfwNnOnY/edit

2. Make sure you have the 40 column headers in Row 1 (you already have these set up)

---

### Step 2: Create the Apps Script

1. **In your Google Sheet, click: Extensions → Apps Script**

2. **Delete any existing code** in the editor

3. **Copy the code from `APPS_SCRIPT_CODE.gs`** (in this project folder)

4. **Paste it into the Apps Script editor**

5. **Save the script:**
   - Click the floppy disk icon 💾 (or File > Save)
   - Name it: "Neptune ROI Webhook"

---

### Step 3: Deploy as Web App

1. **Click the "Deploy" button** (top right corner)

2. **Select "New deployment"**

3. **Click the gear icon ⚙️** next to "Select type"

4. **Choose "Web app"**

5. **Configure the deployment:**
   - **Description:** Neptune ROI Calculator Webhook
   - **Execute as:** Me (your email address)
   - **Who has access:** Anyone

   **CRITICAL:** Must be "Anyone" so Cloudflare can POST to it

6. **Click "Deploy"**

7. **Authorize the script:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" if you see a warning
   - Click "Go to Neptune ROI Webhook (unsafe)" (it's safe, it's your own script)
   - Click "Allow"

8. **Copy the Web App URL:**
   - You'll see a URL like: `https://script.google.com/macros/s/AKfycbxABC123.../exec`
   - **Copy this entire URL** - you'll need it for Cloudflare

---

### Step 4: Add URL to Cloudflare Environment Variables

1. **Go to Cloudflare Dashboard:**
   - Navigate to: Workers & Pages
   - Click on your project: `neptune-lab-roi-calculator`
   - Go to: Settings tab
   - Click: Environment variables

2. **Remove old variables** (if they exist):
   - Delete `GOOGLE_SHEETS_API_KEY`
   - Delete `GOOGLE_SHEETS_SPREADSHEET_ID`

3. **Add new variable:**
   - Click "Add variable"
   - Variable name: `GOOGLE_APPS_SCRIPT_URL`
   - Value: (paste your Apps Script URL from Step 3)
   - Environment: Production
   - Click "Save"

4. **Optionally add to Preview** (for testing):
   - Switch to "Preview" tab
   - Add the same variable
   - This allows testing on preview deployments

---

### Step 5: Trigger New Deployment

After adding the environment variable, trigger a new deployment:

**Option A: Push a change (recommended)**
```bash
git add .
git commit -m "Switch to Apps Script webhook for Google Sheets"
git push
```

**Option B: Manual redeploy in Cloudflare**
1. Go to Deployments tab
2. Click "Retry deployment" on the latest build

---

### Step 6: Test It!

1. Wait for the deployment to complete (2-3 minutes)

2. Visit your site and fill out the ROI calculator

3. Submit the form with your contact details

4. Check your Google Sheet - you should see a new row with all the data!

---

## Testing the Apps Script Directly (Optional)

You can test the Apps Script before connecting it to Cloudflare:

1. **Open the Apps Script editor**

2. **Select the `testDoPost` function** from the dropdown (top toolbar)

3. **Click the "Run" button** ▶️

4. **Authorize if prompted**

5. **Check your Google Sheet** - you should see a test row added

This confirms the script works before integrating with Cloudflare.

---

## Troubleshooting

### "Script function not found: doPost"
- Make sure you copied the entire code from `APPS_SCRIPT_CODE.gs`
- Save the script before deploying

### "Authorization required"
- You must authorize the script to access your Google Sheet
- Click "Advanced" → "Go to [script name]" → "Allow"

### "Cannot read property 'postData' of undefined"
- This error is normal when testing manually
- Use the `testDoPost` function for manual testing
- The `doPost` function only works when called via HTTP POST

### Form submits but no data in sheet
- Check Cloudflare Functions logs for errors
- Verify the `GOOGLE_APPS_SCRIPT_URL` variable is set correctly
- Make sure the URL ends with `/exec` (not `/dev`)
- Try redeploying the Apps Script (Deploy → Manage deployments → Edit → Version: New version → Deploy)

### Data appears in wrong columns
- Verify your Google Sheet has exactly 40 column headers in Row 1
- Check that headers match the order in `GOOGLE_SHEETS_SETUP.md`
- The Apps Script maps data in a specific order

---

## How It Works (Technical Details)

**Your working HTML calculator:**
```javascript
const REPORT_WEBHOOK_URL = 'YOUR_APPS_SCRIPT_URL';

await fetch(REPORT_WEBHOOK_URL, {
  method: 'POST',
  mode: 'no-cors',
  body: JSON.stringify(data)
});
```

**Our Cloudflare Pages Function (now matching your approach):**
```typescript
const response = await fetch(env.GOOGLE_APPS_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

**The Apps Script (server-side):**
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  sheet.appendRow([...data.values]);
  return ContentService.createTextOutput(JSON.stringify({ success: true }));
}
```

**Why this works:**
1. Apps Script runs with YOUR Google account permissions
2. It can write to any sheet you own
3. No OAuth flow needed
4. Simple POST request → Apps Script writes to sheet
5. Same approach as your working HTML calculator ✅

---

## Security Notes

- The Apps Script URL is secret (don't share publicly)
- Only people with the URL can POST data to your sheet
- Apps Script has rate limits (free tier: ~20,000 executions/day)
- If you need more security, you can add a secret token check in the Apps Script

---

## What Gets Saved (40 Columns)

Each form submission creates a new row with complete details:

**Lead Info (6):** Timestamp, Name, Email, Phone, Company, Total

**Factory Settings (5):** Output/hr, Hours/day, Days/month, Material cost, Processing cost

**Pain 1 (5):** Selected, Annual loss, Monthly loss, Rejected trials/month, Run time/batch

**Pain 2 (4):** Selected, Annual loss, Monthly loss, Pigment savings/kg

**Pain 3 (5):** Selected, Annual loss, Monthly loss, Small batch requests/year, Loss/case

**Pain 4 (5):** Selected, Annual loss, Monthly loss, Experiment requests/year, Loss/case

**Pain 5 (5):** Selected, Annual loss, Monthly loss, Recycled material savings/kg, Machines

**Pain 6 (5):** Selected, Annual loss, Monthly loss, Peak season requests/year, Loss/case

**Total: 40 columns of detailed data** ✅

---

## Next Steps After This Works

Once Google Sheets integration is working:

1. ✅ Test thoroughly with different inputs
2. ⚠️ Connect custom domain `neptuneplasticlab.in` to Cloudflare Pages
3. 🔜 Add Resend email integration (send PDF reports)
4. 🔜 Set up email notifications when new leads submit

---

**That's it!** This is the same proven approach from your working HTML calculator. 🎉
