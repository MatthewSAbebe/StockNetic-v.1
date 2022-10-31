var currentDate;
var stockNameResults;
var matchingStockResult;
var matchingStockQuoteDataResult;
var matchingStockResultProfile;
var closePrices = [];
var chartLabels = [];
var closePricesChartingArr = [];
var data = [];

//This is something you need to get better at, returning variables from custom functions. Those values are used in complex, multi-step calculations.
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

  xhrMatchingStockQuoteDataRequest.addEventListener('load', function () {
    matchingStockQuoteDataResult = {
      stockSymbol: xhrMatchingStockQuoteDataRequest.response["Global Quote"]["01. symbol"],
      stockPrice: xhrMatchingStockQuoteDataRequest.response["Global Quote"]["05. price"],
      stockPriceChange: xhrMatchingStockQuoteDataRequest.response["Global Quote"]["09. change"],
      stockPricePercentChange: xhrMatchingStockQuoteDataRequest.response["Global Quote"]["09. change"],
      }

    var quoteDataListElement = document.querySelector('#quote-data-list')
    console.log(quoteDataListElement)
    var quoteDataListPriceElement = quoteDataListElement.firstElementChild;
    console.log(quoteDataListPriceElement)
    console.log(matchingStockQuoteDataResult.stockPrice)
    quoteDataListPriceElement.innerHTML = matchingStockQuoteDataResult.stockPrice;
    quoteDataListElement.appendChild(quoteDataListPriceElement)
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
          closePrices.push(stockData[key]['4. close']);
          chartLabels.push(key);
        }

        for (let i = 0; i < chartLabels.length; i++) {
          for (let k = 0; k < closePrices.length; k++) {
            data.push({Date: Date.parse(chartLabels[i].toString()), Value: Number.parseFloat(closePrices[k])})
        }
      }
        console.log(data)

          var root = am5.Root.new("dailyPriceChart");
      
          // root.setThemes([
          //   am5themes_Animated.new(root)
          // ]);
      
          var stockChart = root.container.children.push(
          am5stock.StockChart.new(root, {})
          );
          
          var mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
            wheelY: "zoomX",
            panX: true,
            panY: true
          }));
      
            var valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
              renderer: am5xy.AxisRendererY.new(root, {})
            }));
            
            var dateAxis = mainPanel.xAxes.push(am5xy.DateAxis.new(root, {
              baseInterval: {
                timeUnit: "day",
                count: 1
              },
              renderer: am5xy.AxisRendererX.new(root, {})
            }));
      
            var valueSeries = mainPanel.series.push(am5xy.LineSeries.new(root, {
                name: "STCK",
                valueXField: "Date",
                valueYField: "Value",
                xAxis: dateAxis,
                yAxis: valueAxis,
                legendValueText: "{valueY}"
              })
            );
            
            valueSeries.data.setAll(data);
      
            stockChart.set("stockSeries", valueSeries);
      
            var valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
              stockChart: stockChart
            }));
            valueLegend.data.setAll([valueSeries]);
    })

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
    })
    xhrMatchingStockOverviewDataRequest.send()
}

export { currentDate, stockNameResults, getMatchingStockQuoteData, getMatchingStockDailyPrices, getMatchingStockOverviewData, closePrices, chartLabels, closePricesChartingArr, data }

