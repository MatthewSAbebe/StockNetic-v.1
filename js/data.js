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
    // console.log(quoteDataListElement)
    var quoteDataListPriceElement = quoteDataListElement.firstElementChild;
    // console.log(quoteDataListPriceElement)
    // console.log(matchingStockQuoteDataResult.stockPrice)
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
          data.push({Date: Date.parse(key), Value: Number.parseFloat(stockData[key]['4. close'])})
        }
        // console.log(data)
        
        var root = am5.Root.new("stockChart");

          root.setThemes([
            am5themes_Animated.new(root)
          ]);

        var stockChart = root.container.children.push(am5stock.StockChart.new(root, {}));
          
        var mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
          wheelY: "zoomX",
          panX: true,
          panY: true,
          height: am5.percent(70)
        }));
      
        var valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            pan: "zoom",
            opposite: true
          }),
          tooltip: am5.Tooltip.new(root, {
            animationDuration:200
          }),
          numberFormat: "#,###.00",
          extraTooltipPrecision: 2
        }));
          
        var dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
          baseInterval: {
            timeUnit: "day",
            count: 1
          },
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {
            animationDuration:200
          })
        }));
  
        var valueSeries = mainPanel.series.push(am5xy.LineSeries.new(root, {
            name: "STCK",
            valueXField: "Date",
            valueYField: "Value",
            xAxis: dateAxis,
            yAxis: valueAxis,
            legendValueText: "{valueY}"
          }));
          
        valueSeries.data.setAll(data);
    
        stockChart.set("stockSeries", valueSeries);
    
        // var valueLegend = mainPanel.topPlotContainer.children.push(am5stock.StockLegend.new(root, {
        //   stockChart: stockChart
        // }));
        // valueLegend.data.setAll([valueSeries]);

        mainPanel.set("cursor", am5xy.XYCursor.new(root, {
          yAxis: valueAxis,
          xAxis: dateAxis,
          snapToSeries: [valueSeries],
          snapToSeriesBy: "y!"
        }))

        // var scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
        //   orientation: "horizontal",
        //   height: 50
        // }));
        // stockChart.toolsContainer.children.push(scrollbar);
        
        // var sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
        //   baseInterval: {
        //     timeUnit: "day",
        //     count: 1
        //   },
        //   renderer: am5xy.AxisRendererX.new(root, {})
        // }));
        
        // var sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
        //   renderer: am5xy.AxisRendererY.new(root, {})
        // }));
        
        // var sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
        //   valueYField: "Value",
        //   valueXField: "Date",
        //   xAxis: sbDateAxis,
        //   yAxis: sbValueAxis
        // }));
        
        // sbSeries.fills.template.setAll({
        //   visible: true,
        //   fillOpacity: 0.3
        // });
        
        // sbSeries.data.setAll(data);
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
        // console.log(matchingStockResultProfile)
    })
    xhrMatchingStockOverviewDataRequest.send()
}

export { currentDate, stockNameResults, getMatchingStockQuoteData, getMatchingStockDailyPrices, getMatchingStockOverviewData, closePrices, chartLabels, closePricesChartingArr, data }

