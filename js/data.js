// import { ColorSet } from "./@amcharts/amcharts5.js";
import { matchingStock } from "./main.js";

var currentDate;
var stockNameResults;
var matchingStockResult;
var matchingStockQuoteDataResult;
var matchingStockOverviewDataResult;
var stockPriceChangeNumber;
var stockPricePercentChangeNumber;
// var matchingStockResultProfile;
var closePrices = [];
var chartLabels = [];
var closePricesChartingArr = [];
var data = [];
var quoteDataListNameElement;

function getCurrentDate () {
    currentDate = new Date();
    return currentDate;
}

getCurrentDate()

/* Get stock names that match the search term*/
function getStockNames() {
    var xhrStockNameDataRequest = new XMLHttpRequest();
    xhrStockNameDataRequest.open('GET', `https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=10&apiKey=pbAveFNWpMw8DCRXcRLi4EFE2ukYHMNN`);
    xhrStockNameDataRequest.responseType = 'json';
    
    xhrStockNameDataRequest.addEventListener('load', function () {
        stockNameResults = xhrStockNameDataRequest.response['results']
    })
    xhrStockNameDataRequest.send()
  }
  
  getStockNames()

function getMatchingStockQuoteData(matchingStockTicker) {
  
  var xhrMatchingStockQuoteDataRequest = new XMLHttpRequest();
  xhrMatchingStockQuoteDataRequest.open('GET', `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${matchingStockTicker}&apikey=pbAveFNWpMw8DCRXcRLi4EFE2ukYHMNN`);
  xhrMatchingStockQuoteDataRequest.responseType = 'json';

  function addNumberSignToStockPriceChangeNumber(matchingStockObj) {
    if (matchingStockObj.stockPriceChange > 0) {
        stockPriceChangeNumber = matchingStockObj.stockPriceChange
        return stockPriceChangeNumber;
      } else if (matchingStockObj.stockPriceChange < 0) {
        stockPriceChangeNumber = matchingStockObj.stockPriceChange
        return stockPriceChangeNumber;
      } else {
        stockPriceChangeNumber = matchingStockObj.stockPriceChange
        return stockPriceChangeNumber;
      }
    }

  function addNumberSignToStockPricePercentChangeNumber(matchingStockObj) {
      if (matchingStockObj.stockPricePercentChange > 0) {
        stockPricePercentChangeNumber = `+${matchingStockObj.stockPricePercentChange}`
        return stockPricePercentChangeNumber;
      } else if (matchingStockObj.stockPricePercentChange < 0) {
        stockPricePercentChangeNumber = `-${matchingStockObj.stockPricePercentChange}`
        return stockPricePercentChangeNumber;
      } else {
        stockPricePercentChangeNumber = matchingStockObj.stockPricePercentChange
        return stockPricePercentChangeNumber
      }
    }

    function appendQuoteData() {
      console.log('data type:', typeof stockPriceChangeNumber, 'stockPriceChangeNumber:', stockPriceChangeNumber)
      console.log('data type:', typeof stockPricePercentChangeNumber, 'stockPricePercentChangeNumer:', stockPricePercentChangeNumber)
      var quoteDataListElement = document.querySelector('#quote-data-list');
      quoteDataListNameElement = quoteDataListElement.firstElementChild;
      var quoteDataListPriceElement = quoteDataListNameElement.nextElementSibling;
      quoteDataListNameElement.innerHTML = matchingStock.name + " " + `(${matchingStock.ticker})`;
      quoteDataListElement.appendChild(quoteDataListNameElement)
      var quotePrice = parseInt(matchingStockQuoteDataResult.stockPrice).toFixed(2);
      quoteDataListPriceElement.innerHTML =`<h2 id="quotePrice">${quotePrice}</h2><sub><p id="quotePriceSubscript">(At close)</p></sub><h3 id="stockPriceChangeNum">${stockPriceChangeNumber}</h3> (${stockPricePercentChangeNumber})`;
      quoteDataListElement.appendChild(quoteDataListPriceElement)
      }

  xhrMatchingStockQuoteDataRequest.addEventListener('load', function () {
    matchingStockQuoteDataResult = {
      stockSymbol: xhrMatchingStockQuoteDataRequest.response["Global Quote"]["01. symbol"],
      stockPrice: xhrMatchingStockQuoteDataRequest.response["Global Quote"]["05. price"],
      stockPriceChange: xhrMatchingStockQuoteDataRequest.response["Global Quote"]["09. change"],
      stockPricePercentChange: xhrMatchingStockQuoteDataRequest.response["Global Quote"]["10. change percent"]
    }
  
    addNumberSignToStockPriceChangeNumber(matchingStockQuoteDataResult);
    addNumberSignToStockPricePercentChangeNumber(matchingStockQuoteDataResult);
    appendQuoteData();

  })
  xhrMatchingStockQuoteDataRequest.send()
  return matchingStockQuoteDataResult;
}

function getMatchingStockDailyPrices(matchingStock) {
    var xhrMatchingStockDailyPricesDataRequest = new XMLHttpRequest();
    xhrMatchingStockDailyPricesDataRequest.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${matchingStock}&apikey=EBZ2O8GQQ9CA3ECX`)
    xhrMatchingStockDailyPricesDataRequest.responseType = 'json';
    xhrMatchingStockDailyPricesDataRequest.addEventListener('load', function () {
        matchingStockResult = xhrMatchingStockDailyPricesDataRequest.response['Time Series (Daily)'];
        var matchingStockWeeklyPriceData = [];
        matchingStockWeeklyPriceData.push(matchingStockResult)
        var stockData = matchingStockWeeklyPriceData[0];
        for (var key in stockData) {
          data.push({Date: Date.parse(key), Value: Number.parseFloat(stockData[key]['4. close'])})
        }
        // console.log(data)
        
        
    });

    xhrMatchingStockDailyPricesDataRequest.send()
}

function getMatchingStockOverviewData(matchingStock) {
    var xhrMatchingStockOverviewDataRequest = new XMLHttpRequest();
    xhrMatchingStockOverviewDataRequest = new XMLHttpRequest();
    xhrMatchingStockOverviewDataRequest.open('GET', `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${matchingStock}&apikey=EBZ2O8GQQ9CA3ECX`)
    xhrMatchingStockOverviewDataRequest.responseType = 'json';
    
    xhrMatchingStockOverviewDataRequest.addEventListener('load', function () {
      console.log(xhrMatchingStockOverviewDataRequest.response)
        matchingStockOverviewDataResult = {
          marketCapitalization: xhrMatchingStockOverviewDataRequest.response["MarketCapitalization"],
          earningsPerShare: xhrMatchingStockOverviewDataRequest.response["EPS"],
          priceEarningsRatio: xhrMatchingStockOverviewDataRequest.response["PERatio"],
          fiftyTwoWeekHigh: xhrMatchingStockOverviewDataRequest.response["52WeekHigh"],
          fiftyTwoWeekLow: xhrMatchingStockOverviewDataRequest.response["52WeekLow"]
        }
        console.log(matchingStockOverviewDataResult)
        var marketCap = matchingStockOverviewDataResult.marketCapitalization;
        console.log('data type:', typeof marketCap, 'data value:', marketCap)
        
        var overviewDataListContainerEl = document.querySelector("#overview-data-list")
        var overviewDataListEl = overviewDataListContainerEl.firstElementChild;
        var marketCapListEl = document.createElement("li")
        marketCapListEl.innerHTML = matchingStockOverviewDataResult.marketCapitalization;
        
        overviewDataListEl.appendChild(marketCapListEl)
        //next add 52 week range, calculate with high and low but do not display them
    })


    xhrMatchingStockOverviewDataRequest.send()
}

export { currentDate, stockNameResults, getMatchingStockQuoteData, getMatchingStockDailyPrices, getMatchingStockOverviewData, closePrices, chartLabels, closePricesChartingArr, data }

