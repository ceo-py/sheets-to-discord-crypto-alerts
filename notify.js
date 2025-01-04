const DISCORD_WEBHOOK_URL = "Your Discord Webhook URL";
const COLORS = {
  RED: "#e06666",
  GREEN: "#b6d7a8",
  BLACK: "black",
};
const SHEET_NAME = "Convertor";
const CRYPTOCURRENCY_API_URL = "https://api.coincap.io/v2/assets";

const CONFIG = {
  discordUrl: DISCORD_WEBHOOK_URL,
  colors: COLORS,
  sheetName: SHEET_NAME,
  changingValueCells: ["H13", "E13", "B7", "C7", "E17"],
  changingColorCells: ["H11", "H15", "I2", "I4", "I3"],
  trackingCurrency: {
    SPX: null,
    HNT: null,
    SOL: null,
  },
};

/**
 * Posts a message to Discord using the webhook URL.
 * @param {string} message - The message to post.
 */
function postMessageToDiscord(message) {
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({ content: message }),
  };

  try {
    UrlFetchApp.fetch(CONFIG.discordUrl, options);
  } catch (error) {
    Logger.log("Error posting message to Discord: %s", error.toString());
  }
}

/**
 * Changes the background color of cells based on value comparison.
 * @param {Array} values - Array containing the cell and its convertor.
 * @param {number} price - The price to compare against.
 */
function changeCellColorBackgroundCompare(values, price) {
  const [cell, cellConvertor] = values;
  const currentValue = cell.getValue();

  let backgroundColor;
  if (currentValue > price) {
    backgroundColor = CONFIG.colors.RED;
  } else if (currentValue < price) {
    backgroundColor = CONFIG.colors.GREEN;
  } else {
    backgroundColor = CONFIG.colors.BLACK;
  }

  cell.setBackground(backgroundColor);
  cellConvertor.setBackground(backgroundColor);
}

/**
 * Changes the background color of a cell based on its value.
 * @param {GoogleAppsScript.Spreadsheet.Range} cell - The cell to change.
 */
function changeCellBackgroundColor(cell) {
  cell.setBackground(
    cell.getValue() < 0 ? CONFIG.colors.RED : CONFIG.colors.GREEN
  );
}

/**
 * Retrieves the value of a cell in a given sheet and range.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to access.
 * @param {string} range - The range notation of the cell.
 * @returns {any} The value of the cell.
 */
function getCellValue(sheet, range) {
  return sheet.getRange(range).getValue();
}

/**
 * Retrieves the range object of a cell in a given sheet and range.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to access.
 * @param {string} range - The range notation of the cell.
 * @returns {GoogleAppsScript.Spreadsheet.Range} The range object.
 */
function getCellRange(sheet, range) {
  return sheet.getRange(range);
}

/**
 * Parses the JSON response from the cryptocurrency API.
 * @returns {Object} The parsed JSON response.
 */
function parseJsonResponse() {
  try {
    const response = UrlFetchApp.fetch(CRYPTOCURRENCY_API_URL);
    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log("Error fetching cryptocurrency data: %s", error.toString());
    return null;
  }
}

/**
 * Sets the background color for tracking currency cells.
 * @param {Object} config - The configuration object.
 * @param {string} currency - The currency symbol.
 * @param {Array} cells - The cells to set.
 */
function setColorBackgroundCells(config, currency, cells) {
  config.trackingCurrency[currency] = cells;
}

/**
 * Main function to execute the script logic.
 */
function myFunction() {
  const parsedData = parseJsonResponse();
  if (!parsedData) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    CONFIG.sheetName
  );

  const [h13, e13, b7, c7, e17] = CONFIG.changingValueCells.map((cell) =>
    getCellValue(sheet, cell)
  );
  const [h11Helium, h15Sp8de, i2Sp8de, i3Helium, i4Solana] =
    CONFIG.changingColorCells.map((cell) => getCellRange(sheet, cell));

  setColorBackgroundCells(CONFIG, "SPX", [i2Sp8de, h15Sp8de]);
  setColorBackgroundCells(CONFIG, "HNT", [i3Helium, h11Helium]);
  setColorBackgroundCells(CONFIG, "SOL", [i4Solana, i4Solana]);

  const valueDifference = h13 - e13;

  Object.keys(CONFIG.trackingCurrency).forEach((currency, i) => {
    const allItems = parsedData.data.find((item) => item.symbol === currency);
    if (allItems) {
      const itemsArray = Object.values(allItems);
      changeCellColorBackgroundCompare(
        CONFIG.trackingCurrency[currency],
        allItems.priceUsd
      );
      sheet.getRange(i + 2, 1, 1, itemsArray.length).setValues([itemsArray]);
    }
  });

  const h13BackgroundColor = getCellRange(sheet, "H13");
  h13BackgroundColor.setBackground(
    e13 > h13 ? CONFIG.colors.RED : CONFIG.colors.GREEN
  );
  changeCellBackgroundColor(getCellRange(sheet, "D7"));
  changeCellBackgroundColor(getCellRange(sheet, "G13"));

  if (e17 === 0.00) {
    return;
  }
  if (valueDifference >= b7 || valueDifference <= c7) {
    postMessageToDiscord(valueDifference.toString());
  }
}

/**
 * Trigger function to set up a time-based trigger on edit.
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e - The onEdit event object.
 */
function onEdit(e) {
  const range = e.range;
  if (range.getA1Notation() !== "A7") return;

  const triggerName = "myFunction";
  const intervalInMinutes = range.getValue();

  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === triggerName) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger(triggerName)
    .timeBased()
    .everyMinutes(intervalInMinutes)
    .create();
}
