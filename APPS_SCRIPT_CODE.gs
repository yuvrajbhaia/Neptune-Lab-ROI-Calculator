// Google Apps Script for Neptune ROI Calculator
// Deploy this as a Web App in your Google Sheet

function doPost(e) {
  try {
    // Get the active spreadsheet and Sheet1
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Extract the row data (40 columns)
    const rowData = [
      // Submission Info (6 columns)
      data.timestamp,
      data.lead.name,
      data.lead.email,
      data.lead.phone,
      data.lead.company,
      data.total,

      // Factory Settings (5 columns)
      data.inputs.factory.outputPerHour,
      data.inputs.factory.workingHoursPerDay,
      data.inputs.factory.workingDaysPerMonth,
      data.inputs.factory.materialCostPerKg,
      data.inputs.factory.processingCostPerKg,

      // Pain 1: Color Rejection (5 columns)
      data.pain1.selected,
      data.pain1.annualLoss,
      data.pain1.monthlyLoss,
      data.inputs.pain1.rejectedTrialsPerMonth,
      data.inputs.pain1.runTimePerBatch,

      // Pain 2: R&D Pigments (4 columns)
      data.pain2.selected,
      data.pain2.annualLoss,
      data.pain2.monthlyLoss,
      data.inputs.pain2.pigmentSavingsPerKg,

      // Pain 3: Small Batch Trials (5 columns)
      data.pain3.selected,
      data.pain3.annualLoss,
      data.pain3.monthlyLoss,
      data.inputs.pain3.smallBatchRequestsPerYear,
      data.inputs.pain3.lossPerCase,

      // Pain 4: Lab Experiments (5 columns)
      data.pain4.selected,
      data.pain4.annualLoss,
      data.pain4.monthlyLoss,
      data.inputs.pain4.experimentRequestsPerYear,
      data.inputs.pain4.lossPerCase,

      // Pain 5: Recycled Material (5 columns)
      data.pain5.selected,
      data.pain5.annualLoss,
      data.pain5.monthlyLoss,
      data.inputs.pain5.recycledMaterialSavingsPerKg,
      data.inputs.pain5.numberOfMachines,

      // Pain 6: Peak Season Trials (5 columns)
      data.pain6.selected,
      data.pain6.annualLoss,
      data.pain6.monthlyLoss,
      data.inputs.pain6.peakSeasonRequestsPerYear,
      data.inputs.pain6.lossPerCase,
    ];

    // Append the row to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        timestamp: data.timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'Failed to save data'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for debugging)
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        lead: {
          name: "Test User",
          email: "test@example.com",
          phone: "+91 98765 43210",
          company: "Test Company"
        },
        total: 1000000,
        inputs: {
          factory: {
            outputPerHour: 200,
            workingHoursPerDay: 22,
            workingDaysPerMonth: 25,
            materialCostPerKg: 100,
            processingCostPerKg: 10
          },
          pain1: { rejectedTrialsPerMonth: 1, runTimePerBatch: 3 },
          pain2: { pigmentSavingsPerKg: 1 },
          pain3: { smallBatchRequestsPerYear: 3, lossPerCase: 25000 },
          pain4: { experimentRequestsPerYear: 3, lossPerCase: 25000 },
          pain5: { recycledMaterialSavingsPerKg: 1, numberOfMachines: 1 },
          pain6: { peakSeasonRequestsPerYear: 2, lossPerCase: 25000 }
        },
        pain1: { selected: "YES", annualLoss: 100000, monthlyLoss: 8333 },
        pain2: { selected: "YES", annualLoss: 100000, monthlyLoss: 8333 },
        pain3: { selected: "YES", annualLoss: 75000, monthlyLoss: 6250 },
        pain4: { selected: "NO", annualLoss: 0, monthlyLoss: 0 },
        pain5: { selected: "YES", annualLoss: 100000, monthlyLoss: 8333 },
        pain6: { selected: "NO", annualLoss: 0, monthlyLoss: 0 }
      })
    }
  };

  const response = doPost(testData);
  Logger.log(response.getContent());
}
