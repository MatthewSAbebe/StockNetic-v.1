// import { ColorSet } from "./@amcharts/amcharts5.js";
import { matchingStock } from "./main.js";

var currentDate;
var stockNameResults;
var matchingStockResult;
var matchingStockQuoteDataResult;
var stockPriceChangeNumber;
var stockPricePercentChangeNumber;
var matchingStockResultProfile;
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
    if (parseInt(matchingStockObj.stockPriceChange) > 0) {
        stockPriceChangeNumber = `+${matchingStockObj.stockPriceChange}`
        return stockPriceChangeNumber;
      } else if (parseInt(matchingStockObj.stockPriceChange) < 0) {
        stockPriceChangeNumber = `-${matchingStockObj.stockPriceChange}`
        return stockPriceChangeNumber;
      } else {
        stockPriceChangeNumber = matchingStockObj.stockPriceChange
        return stockPriceChangeNumber;
      }
    }

  function addNumberSignToStockPricePercentChangeNumber(matchingStockObj) {
      if (parseInt(matchingStockObj.stockPricePercentChange) > 0) {
        stockPricePercentChangeNumber = `+${matchingStockObj.stockPricePercentChange}`
        return stockPricePercentChangeNumber;
      } else if (parseInt(matchingStockObj.stockPricePercentChange) < 0) {
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
      quoteDataListPriceElement.innerHTML = `<h2 id="quotePrice">${quotePrice}</h2><sub><p id="quotePriceSubscript">(At close)</p></sub>&nbsp&nbsp<h3 id="stockPriceChangeNum">${stockPriceChangeNumber}</h3> (${stockPricePercentChangeNumber})`;
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
        
        var root = am5.Root.new("stockChart");

          root.setThemes([
            am5themes_Animated.new(root)
          ]);

        var stockChart = root.container.children.push(am5stock.StockChart.new(root, {
          stockPositiveColor: am5.color(0x999999),
          stockNegativeColor: am5.color(0x000000)
        }));
          
        var mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
          wheelY: "zoomX",
          panX: false,
          panY: false,
          height: am5.percent(70)
        }));
      
        var valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            pan: "zoom",
            opposite: true,
            baseValue: 0
          }),
          tooltip: am5.Tooltip.new(root, {
            animationDuration:200
          }),
          numberFormat: "#,###.00",
          extraTooltipPrecision: 2
        }));

        // var ColorSet = am5.ColorSet.new(root, {

        // });
   
        var dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
          baseInterval: {
            timeUnit: "day",
            count: 1
          },
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {
            animationDuration:200
          }),
          // strokeSettings: {
          //   stroke: ColorSet.getIndex(0)
          // },
          // fillSettings: {
          //   fill: ColorSet.getIndex(0),
          // },
          // bulletSettings: {
          //   fill: ColorSet.getIndex(0)
          // }
        }));
  
        var valueSeries = mainPanel.series.push(am5xy.LineSeries.new(root, {
            name: `${matchingStock}`,
            valueXField: "Date",
            valueYField: "Value",
            xAxis: dateAxis,
            yAxis: valueAxis,
            legendValueText: "{valueY}",
            fill: am5.color(0x095256),
            stroke: am5.color(0x095256)
          }));
          
        valueSeries.data.setAll(data);
    
        stockChart.set("stockSeries", valueSeries);

        var valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
          stockChart: stockChart
        }));
        valueLegend.data.setAll([valueSeries]);

        mainPanel.set("cursor", am5xy.XYCursor.new(root, {
          yAxis: valueAxis,
          xAxis: dateAxis,
          snapToSeries: [valueSeries],
          snapToSeriesBy: "y!"
        }))

        // var stockChartModal = document.getElementsByClassName("am5-modal")
        // console.log(stockChartModal)
        // stockChartModal.remove()
        
        var stockChartParentElement = document.querySelector('#stockChart');
        console.log(stockChartParentElement)

        // domtraversal
        var stockChartChildrenElements = stockChartParentElement.childNodes[0];
        console.log(stockChartChildrenElements)

        stockChartChildrenElements.removeChild(stockChartChildrenElements.childNodes[4])
        console.log(stockChartChildrenElements)

        // var stockChartToolTips = stockChartChildrenElements.childNodes[4]
        // stockChartToolTips.removeChild()
        // console.log(stockChartToolTips)

        // var tooltipForRemoval = stockChartParentTooltipElements.childNodes[]
        // var removeChartLinkTextNode = stockChartParentElement.childNodes[0].ATTRIBUTE_NODE

        // stockChartParentElement.childNodes[0].removeChild(2)

        // var stockChartElementChildNodes = stockChartParentElement.childNodes[0]
        // console.log(stockChartElementChildNodes)
    });

    xhrMatchingStockDailyPricesDataRequest.send()
}

function getMatchingStockOverviewData(matchingStock) {
    var xhrMatchingStockOverviewDataRequest = new XMLHttpRequest();
    xhrMatchingStockOverviewDataRequest = new XMLHttpRequest();
    xhrMatchingStockOverviewDataRequest.open('GET', `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${matchingStock}&apikey=EBZ2O8GQQ9CA3ECX`)
    xhrMatchingStockOverviewDataRequest.responseType = 'json';
    
    xhrMatchingStockOverviewDataRequest.addEventListener('load', function () {
        matchingStockResultProfile = xhrMatchingStockOverviewDataRequest.response;
        console.log(matchingStockResultProfile)

        // var quoteDataListNameElement = quoteDataListElement.firstElementChild
    })
    xhrMatchingStockOverviewDataRequest.send()
}

export { currentDate, stockNameResults, getMatchingStockQuoteData, getMatchingStockDailyPrices, getMatchingStockOverviewData, closePrices, chartLabels, closePricesChartingArr, data }

