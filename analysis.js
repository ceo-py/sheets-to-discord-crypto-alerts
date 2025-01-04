const ANALYSIS_SHEET_NAME = "Analysis"
const HELIUM_URL = "https://altfins.com/blog/helium-hnt-analysis/"
const HELIUM = "helium"
const HELIUM_CODE = "hnt"
const HELIUM_CELL_GRAPH = "A4"
const HELIUM_CELL_NAME = "E3"
const SOLANA_URL = "https://altfins.com/blog/solana-sol-analysis/"
const SOLANA = "solana"
const SOLANA_CODE = "sol"
const SOLANA_CELL_GRAPH = "A34"
const SOLANA_CELL_NAME = "E33"
const IMAGE_WIDTH = 1000;
const IMAGE_HEIGHT = 550;

const CONFIG_ANALYSIS = {
  sheetName: ANALYSIS_SHEET_NAME,

  graphData: [
    {
      coinName: HELIUM,
      coinCode: HELIUM_CODE,
      cellToDispalyGraph: HELIUM_CELL_GRAPH,
      cellToDispalyName: HELIUM_CELL_NAME,
    },
    {
      coinName: SOLANA,
      coinCode: SOLANA_CODE,
      cellToDispalyGraph: SOLANA_CELL_GRAPH,
      cellToDispalyName: SOLANA_CELL_NAME,
    }],
}

function generateUrlForGraph(name, code) {
  return `https://altfins.com/blog/${name}-${code}-analysis/`
}

function getGraphUrl(text) {
  return text.split('srcset=')[3].split(' ')[0].slice(1)
}

function generateFormula(analysisLink, graphLink, setHeight, setWidth) {
  return '=HYPERLINK("' + analysisLink + '", IMAGE("' + graphLink + '", 4, ' + setHeight + ', ' + setWidth + '))'
}

function myFunctionAnalysis() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_ANALYSIS.sheetName);
  CONFIG_ANALYSIS.graphData.forEach(x => {
    var generatedUrl = generateUrlForGraph(x.coinName, x.coinCode)
    var response = UrlFetchApp.fetch(generatedUrl);
    var responseText = response.getContentText();
    var graphUrl = getGraphUrl(responseText)
    sheet.getRange(x.cellToDispalyGraph).setFormula(generateFormula(generatedUrl, graphUrl, CONFIG_ANALYSIS.imageHeight, CONFIG_ANALYSIS.imageWidth));
    sheet.getRange(x.cellToDispalyName).setValue(x.coinName.toUpperCase())
  })
}