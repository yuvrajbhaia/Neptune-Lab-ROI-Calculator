# Neptune Lab ROI Calculator - Project Documentation

## Overview

A Next.js-based ROI (Return on Investment) calculator for Neptune Plastics that helps potential customers calculate their annual savings by addressing specific manufacturing pain points. The application features an interactive multi-step calculator, dynamic PDF generation, and lead capture functionality.

**Live Site:** https://neptune-lab-roi-calculator.pages.dev

## Tech Stack

- **Framework:** Next.js 16.1.4 (App Router, Static Export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **PDF Generation:** jsPDF + html2canvas
- **Deployment:** Cloudflare Pages
- **Backend:** Cloudflare Pages Functions + Google Apps Script

## Project Structure

```
/src
├── app/
│   ├── layout.tsx                    # Root layout with fonts and metadata
│   ├── page.tsx                      # Landing page
│   ├── calculator/
│   │   ├── page.tsx                  # Multi-step calculator form
│   │   └── results/
│   │       └── page.tsx              # Results page with pain point selection
│   └── api/
│       └── submit/
│           └── route.ts              # API route for form submission (redirects to Cloudflare Function)
├── components/
│   ├── landing/                      # Landing page components
│   │   ├── header.tsx                # Navigation header
│   │   ├── hero.tsx                  # Hero section with CTA
│   │   ├── customers.tsx             # Customer logos slider
│   │   ├── video-section.tsx         # Video testimonial section
│   │   ├── stats.tsx                 # Company statistics
│   │   ├── global-reach.tsx          # Global presence map
│   │   └── footer.tsx                # Footer with links
│   ├── calculator/                   # Calculator components
│   │   ├── progress-bar.tsx          # Multi-step progress indicator
│   │   └── step-container.tsx        # Container for calculator steps
│   ├── results/                      # Results page components
│   │   ├── pain-card.tsx             # Individual pain point card
│   │   ├── blurred-total.tsx         # Blurred total before form submission
│   │   ├── lead-form.tsx             # Lead capture form
│   │   ├── explain-modal.tsx         # Explanation modal for pain points
│   │   └── download-modal.tsx        # Download confirmation modal
│   └── ui/                           # Reusable UI components
│       ├── button.tsx                # Button component
│       ├── input.tsx                 # Input component
│       ├── map.tsx                   # Interactive world map
│       ├── video-player.tsx          # Video player component
│       ├── colourful-text.tsx        # Animated gradient text
│       ├── infinite-slider.tsx       # Infinite scrolling slider
│       └── progress-indicator.tsx    # Progress indicator
├── lib/
│   ├── calculations.ts               # ROI calculation logic for all pain points
│   ├── pdf-generator.ts              # PDF generation (ROI Report + Quotation)
│   ├── calculator-context.tsx        # React Context for calculator state
│   └── utils.ts                      # Utility functions (cn, etc.)
└── functions/
    └── api/
        └── submit/
            └── index.ts              # Cloudflare Pages Function for form submission
```

## Key Features

### 1. Landing Page
- Hero section with animated gradient text
- Customer logos with infinite scroll animation
- Video testimonial section
- Company statistics
- Interactive global reach map
- Responsive footer

### 2. Multi-Step Calculator (5 Steps)
**Step 1: Factory Settings**
- Output per hour (kg/hr)
- Working hours per day
- Working days per month
- Material cost per kg (₹)
- Processing cost per kg (₹)

**Step 2-5: Pain Point Specific Questions**
Each pain point has custom parameters that affect ROI calculation:
1. **Color Rejection After Stretching** - trials rejected, run time
2. **Missed R&D Opportunities** - pigment savings
3. **Competitive Pressure & Recycled Material** - recycled material savings, machines
4. **Small Batch Customer Trials** - batch requests, loss per case
5. **Innovation Blocked** - experiment requests, loss per case
6. **Peak Season Nightmare** - peak season requests, loss per case

### 3. Results Page
- **Factory Settings Panel** - Editable inputs from calculator
- **Pain Point Selection** - Interactive cards with expand/collapse
- **Dynamic ROI Calculation** - Real-time calculation based on selections
- **Blurred Total** - Teaser before lead capture
- **Lead Form** - Name, email, phone, company
- **Download Modal** - Confirmation popup before PDF download
- **Dual PDF Generation:**
  - ROI Report (detailed breakdown)
  - Quotation (pricing information)

### 4. PDF Generation
**ROI Report:**
- Company branding
- Factory settings summary
- Selected pain points breakdown
- Total annual impact
- Monthly impact
- Savings visualization

**Quotation:**
- Customer information
- Pricing details
- Terms and conditions
- Contact information

### 5. Lead Capture & Data Flow
```
User submits form → Cloudflare Pages Function (/functions/api/submit/index.ts)
                  ↓
            Google Apps Script Webhook
                  ↓
            Google Sheets Database
```

## Pain Point Calculations

All calculations are in `/src/lib/calculations.ts`

### Pain 1: Color Rejection After Stretching
```
Annual Loss = (Rejected Trials × Run Time × Working Hours/Day × Material Cost × Output/Hour × Working Days/Month × 12)
```

### Pain 2: Missed R&D Opportunities
```
Annual Loss = Pigment Savings × Output/Hour × Working Hours/Day × Working Days/Month × 12
```

### Pain 3: Competitive Pressure & Recycled Material
```
Annual Loss = Recycled Material Savings × Output/Hour × Working Hours/Day × Working Days/Month × 12 × Number of Machines
```

### Pain 4: Small Batch Customer Trials
```
Annual Loss = Small Batch Requests/Year × Loss Per Case
```

### Pain 5: Innovation Blocked
```
Annual Loss = Experiment Requests/Year × Loss Per Case
```

### Pain 6: Peak Season Nightmare
```
Annual Loss = Peak Season Requests/Year × Loss Per Case
```

## State Management

**Calculator Context** (`/src/lib/calculator-context.tsx`)
- Manages all calculator inputs across steps
- Provides factory settings to results page
- Persists data through navigation

**Results Page State:**
- `selectedPainPoints` - Array of selected pain point IDs
- `inputs` - Individual pain point parameters
- `results` - Calculated ROI for each pain point
- `isSubmitted` - Lead form submission status
- `leadData` - Captured lead information
- `isDownloading` - PDF download state

## Styling Guidelines

**Color Palette:**
- Primary Coral: `#E07A5F`
- Dark Text: `#1A1A1A`
- Gray Text: `#6B7280`
- Background: `#F9FAFB`
- Borders: `#E5E7EB`

**Typography:**
- Font Family: Inter (via next/font/google)
- Responsive text sizing using Tailwind breakpoints

**Animations:**
- Framer Motion for page transitions
- Smooth expand/collapse for pain point cards
- Gradient text animation (0.3s → 3s cycle)
- Infinite slider for customer logos

## Environment Variables

**Required:**
```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

**Configuration:**
- Set in Cloudflare Pages Dashboard: Settings > Environment variables
- Required for both Production and Preview environments
- Used by Cloudflare Pages Function to submit lead data

## Deployment

**Platform:** Cloudflare Pages

**Build Configuration:**
- Build command: `npm run build`
- Build output directory: `out`
- Node version: 18.x+
- Framework: Next.js (Static Export)

**Deployment Methods:**

1. **Git Integration (Automatic):**
   - Push to `main` branch on GitHub
   - Cloudflare automatically builds and deploys
   - Live in 1-3 minutes

2. **Manual (Wrangler CLI):**
   ```bash
   npm run build
   npx wrangler pages deploy out --project-name=neptune-lab-roi-calculator --branch=main
   ```

**Repository:** https://github.com/yuvrajbhaia/Neptune-Lab-ROI-Calculator.git

## Development

**Start Dev Server:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run start
```

## Key Files to Know

### Critical Files
- `/src/app/calculator/results/page.tsx` - Main results page (1000+ lines)
- `/src/lib/calculations.ts` - All ROI calculation logic
- `/src/lib/pdf-generator.ts` - PDF generation logic
- `/functions/api/submit/index.ts` - Serverless form submission handler

### Configuration Files
- `next.config.ts` - Next.js config (static export enabled)
- `wrangler.toml` - Cloudflare Pages configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `.env.example` - Environment variables template

## Common Tasks

### Adding a New Pain Point

1. **Update calculations.ts:**
   ```typescript
   export const calculatePainX = (inputs: FactoryInputs, params: PainXParams) => {
     // Add calculation logic
   };
   ```

2. **Update results page:**
   - Add new pain point card in `painPoints` array
   - Add state for parameters
   - Add calculation call
   - Update total calculation

3. **Update PDF generator:**
   - Add pain point to report template

### Modifying Factory Settings

1. Edit input fields in `/src/app/calculator/page.tsx` (Step 1)
2. Update `FactoryInputs` interface in `/src/lib/calculator-context.tsx`
3. Update calculations in `/src/lib/calculations.ts` if needed

### Changing Text/Copy

- Landing page: `/src/app/page.tsx` and `/src/components/landing/*`
- Calculator: `/src/app/calculator/page.tsx`
- Results page: `/src/app/calculator/results/page.tsx`
- Pain point descriptions: In `painPoints` array in results page

### Updating Styling

- Global styles: `/src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component-specific: Inline Tailwind classes in TSX files

## Troubleshooting

### Changes Not Showing on Deployed Site

1. **Hard refresh browser:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Check in incognito mode** to bypass browser cache
3. **Manually deploy with Wrangler:**
   ```bash
   npm run build
   npx wrangler pages deploy out --project-name=neptune-lab-roi-calculator --branch=main
   ```
4. **Check Cloudflare Dashboard:** Verify deployment status in Workers & Pages

### Build Errors

1. Check TypeScript errors: `npm run build`
2. Verify all imports are correct
3. Check for missing dependencies
4. Clear `.next` and `out` directories, rebuild

### PDF Generation Issues

1. Check console for errors
2. Verify all data is present before generation
3. Test html2canvas rendering
4. Check jsPDF configuration

### Form Submission Not Working

1. Verify `GOOGLE_APPS_SCRIPT_URL` is set in Cloudflare
2. Check Google Apps Script webhook is deployed
3. Test webhook URL manually with curl/Postman
4. Check browser Network tab for API errors
5. Verify CORS settings on Google Apps Script

## Performance Optimizations

- **Static Export:** All pages pre-rendered at build time
- **Image Optimization:** Disabled for static export compatibility
- **Code Splitting:** Automatic via Next.js App Router
- **CDN Delivery:** Cloudflare's global CDN
- **Lazy Loading:** Components loaded on demand
- **Memoization:** React Context memoized values

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

1. **Static Export:** No server-side rendering or API routes (uses Cloudflare Functions instead)
2. **Image Optimization:** Disabled due to static export
3. **PDF Generation:** Client-side only, may be slow on older devices
4. **Browser Cache:** Users may need hard refresh to see updates

## Future Enhancements

- [ ] Email confirmation after form submission (Resend integration)
- [ ] Admin dashboard for viewing leads
- [ ] A/B testing for pain point messaging
- [ ] Multi-language support
- [ ] Advanced analytics integration
- [ ] Custom domain setup
- [ ] Progressive Web App (PWA) features

## Contact & Support

- **Repository:** https://github.com/yuvrajbhaia/Neptune-Lab-ROI-Calculator
- **Deployed Site:** https://neptune-lab-roi-calculator.pages.dev
- **Cloudflare Dashboard:** https://dash.cloudflare.com

## Notes for Claude

- Always read the results page (`/src/app/calculator/results/page.tsx`) before making changes - it's the most complex file
- ROI calculations are centralized in `/src/lib/calculations.ts`
- When modifying pain points, update: results page, calculations, and PDF generator
- Use Wrangler CLI for immediate deployments to bypass cache issues
- The app uses Cloudflare Pages Functions, not Next.js API routes (static export limitation)
- Factory settings are passed via React Context from calculator to results page
- PDF generation happens client-side using jsPDF + html2canvas
- Lead data flows: Form → Cloudflare Function → Google Apps Script → Google Sheets
