const discordUrl =
  "https://discord.com/api/webhooks/1185513855909105735/6AdmZTCN_jeiGzlFQPPAly3irk6KS7RVUxGJSXNXr63Y4iO1KPjMEOqn2BbO5Z92NR1h";
const redColor = "#e06666";
const greenColor = "#b6d7a8";
const convertorSheetName = "Convertor";
const cryptoCurrencyApiUrl = "https://api.coincap.io/v2/assets";

const table = {
  discordUrl,
  colors: {
    red: redColor,
    green: greenColor,
    black: "black",
  },
  sheetName: convertorSheetName,
  changingValueCells: ["H13", "E13", "B7", "C7", "E17"],
  changingColorCells: ["H11", "H15", "I2", "I4", "I3"],
  trackingCurrency: {
    SOL: null,
    HNT: null,
    SPX: null,
  },
};

function postMessageToDiscord(message) {
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      content: message,
    }),
  };
  UrlFetchApp.fetch(discordUrl, options);
}

function changeCellColorBackgroundCompare(values, price) {
  const [cell, cellConvertor] = values;
  const currentValue = cell.getValue();

  let backgroundColor;
  if (currentValue > price) {
    backgroundColor = table.colors.red;
  } else if (currentValue < price) {
    backgroundColor = table.colors.green;
  } else {
    backgroundColor = table.colors.black;
  }

  cell.setBackground(backgroundColor);
  cellConvertor.setBackground(backgroundColor);
}
function changeCellBackgroundColor(cell) {
  cell.setBackground(
    cell.getValue() < 0 ? table.colors.red : table.colors.green
  );
}

function getCellValue(sheet, range) {
  return sheet.getRange(range).getValue();
}

function getCellRange(sheet, range) {
  return sheet.getRange(range);
}

function parseJsonResponse(cryptoCurrencyApiUrl) {
  const response = UrlFetchApp.fetch(cryptoCurrencyApiUrl);
  const jsonResponse = response.getContentText();
  return JSON.parse(jsonResponse);
}

function setColorBackgroundCells(table, currency, cells) {
  table.trackingCurrency[currency] = cells;
}

function myFunction() {
  const parsedData = parseJsonResponse(cryptoCurrencyApiUrl);

  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(convertorSheetName);

  const [h13, e13, b7, c7, e17] = table.changingValueCells.map((cell) =>
    getCellValue(sheet, cell)
  );
  const [h11Helium, h15Solana, i2Solana, i3Helium, i4Sp8de] =
    table.changingColorCells.map((cell) => getCellRange(sheet, cell));
  setColorBackgroundCells(table, "SOL", [i2Solana, h15Solana]);
  setColorBackgroundCells(table, "HNT", [i3Helium, h11Helium]);
  setColorBackgroundCells(table, "SPX", [i4Sp8de, i4Sp8de]);

  const valueDifference = h13 - e13;

  Object.keys(table.trackingCurrency).forEach((currency, i) => {
    const allItems = parsedData.data.find((item) => item.symbol === currency);
    const itemsArray = Object.values(allItems);
    changeCellColorBackgroundCompare(
      table.trackingCurrency[currency],
      allItems.priceUsd
    );
    sheet.getRange(i + 2, 1, 1, itemsArray.length).setValues([itemsArray]);
  });

  const h13BackgroundColor = getCellRange(sheet, "H13");

  h13BackgroundColor.setBackground(
    e13 > h13 ? table.colors.red : table.colors.green
  );
  changeCellBackgroundColor(getCellRange(sheet, "D7"));
  changeCellBackgroundColor(getCellRange(sheet, "G13"));

  if (
    (e17 !== 0.0 && valueDifference >= b7) ||
    (valueDifference <= c7 && e17 !== 0.0)
  ) {
    postMessageToDiscord(valueDifference.toString());
  }
}

function onEdit(e) {
  const range = e.range;
  if (range.getA1Notation() !== "A7") return;

  const triggerName = "myFunction";
  const intervalInMinutes = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
    .getRange("A7")
    .getValue();

  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === triggerName) {
      ScriptApp.deleteTrigger(triggers[i]);
      break;
    }
  }

  ScriptApp.newTrigger(triggerName)
    .timeBased()
    .everyMinutes(intervalInMinutes)
    .create();
}
