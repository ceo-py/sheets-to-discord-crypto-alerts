const analysisSheetName = "Analysis"
const helium = "https://altfins.com/blog/helium-hnt-analysis/"
const solana = "https://altfins.com/blog/solana-sol-analysis/"
const imageWidth = 1000;
const imageHeight = 550;

const CONFIG = {
  graphData: [
    {
      coinName: "helium",
      coinCode: "hnt",
      cellToDispalyGraph: "A4",
      cellToDispalyName: "E3",
    },
    {
      coinName: "solana",
      coinCode: "sol",
      cellToDispalyGraph: "A34",
      cellToDispalyName: "E33",
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
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(analysisSheetName);
  graphData.forEach(x => {
    var generatedUrl = generateUrlForGraph(x.coinName, x.coinCode)
    var response = UrlFetchApp.fetch(generatedUrl);
    var responseText = response.getContentText();
    var graphUrl = getGraphUrl(responseText)
    sheet.getRange(x.cellToDispalyGraph).setFormula(generateFormula(generatedUrl, graphUrl, imageHeight, imageWidth));
    sheet.getRange(x.cellToDispalyName).setValue(x.coinName.toUpperCase())
  })
}